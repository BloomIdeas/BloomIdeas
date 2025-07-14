// components/enhanced-idea-modal.tsx
"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  X,
  Heart,
  Users,
  Github,
  ExternalLink,
  Leaf,
  Calendar,
  TrendingUp,
  MessageCircle,
  Send,
  Code,
  Zap,
} from "lucide-react"
import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { getSproutTypeId } from "@/lib/sprouts"
import { useSprouts } from "@/hooks/use-sprouts"
import { useAccount } from "wagmi"
import { useSignatureVerification } from "@/hooks/use-signature-verification"
import { toast } from "sonner"
import Link from "next/link"
import { useRef } from "react"

interface EnhancedIdeaModalProps {
  idea: {
    id: number
    title: string
    description: string
    fullDescription?: string
    stage: "planted" | "growing" | "bloomed"
    created_at: string
    owner_address?: string
    author?: string
    bloomScore?: number
    nurtureCount: number
    neglectCount: number
    commentCount: number
    joinCount: number
    techStack?: string[]
    team?: { name: string; role: string; avatar?: string }[]
    milestones?: { name: string; status: string; progress: number; date: string }[]
    bloomUsername?: string // Added bloomUsername to the interface
  }
  onClose: () => void
  onProfileClick: (address: string) => void
  links?: { id: number; url: string; label?: string }[]
  visuals?: { id: number; url: string; alt_text?: string }[]
  walletAddress?: string // <-- add this
}

// Helper to parse markdown sections
function parseDescriptionSections(description: string) {
  // Section headers in the order we want to display
  const sectionOrder = [
    { key: "problem", label: "What problem does your idea solve?" },
    { key: "vision", label: "Vision" },
    { key: "features", label: "Features" },
    { key: "tech", label: "Tech" },
    { key: "targetUsers", label: "Who is it for? (target users, impact)" },
    { key: "unique", label: "What makes it unique?" },
  ];
  const regex = /## +([^\n]+)\n/g;
  const matches = [...description.matchAll(regex)];
  const sections: Record<string, string> = {};
  const extraSections: { header: string; content: string }[] = [];
  let lastEnd = 0;
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index! + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : description.length;
    const header = matches[i][1].trim();
    const section = sectionOrder.find(s => header.toLowerCase().replace(/[^a-z]/gi, '') === s.label.toLowerCase().replace(/[^a-z]/gi, ''));
    if (section) {
      sections[section.key] = description.slice(start, end).trim();
    } else {
      extraSections.push({ header, content: description.slice(start, end).trim() });
    }
    lastEnd = end;
  }
  return { sections, extraSections };
}

export default function EnhancedIdeaModal({
  idea,
  onClose,
  onProfileClick,
  links = [],
  visuals = [],
  walletAddress,
}: EnhancedIdeaModalProps) {
  const [activeTab, setActiveTab] = useState<"overview"|"progress"|"team"|"community">("overview")
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  // Remove useAccount for address unless needed elsewhere
  // const { address, isConnected } = useAccount()
  const { hasVerifiedSignature } = useSignatureVerification()
  const { totalSprouts, refreshSprouts } = useSprouts(walletAddress ?? null)
  console.log('totalSprouts:', totalSprouts)
  const [userCommentCount, setUserCommentCount] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  // Helper: get required sprouts for next comment
  function getRequiredSprouts(count: number) {
    if (count === 0) return 5
    if (count === 1) return 4
    return 3
  }
  const requiredSprouts = getRequiredSprouts(userCommentCount)

  // Modal outside click handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  // determine author/address fallback
  const authorAddr = idea.author || idea.owner_address || ""
  const initials = authorAddr.slice(2, 4).toUpperCase() || "??"

  // status badge helper
  const getStatusInfo = (s: string) => {
    switch (s) {
      case "planted":
        return { emoji: "🌱", label: "Planted", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
      case "growing":
        return { emoji: "🌿", label: "Growing", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }
      case "bloomed":
        return { emoji: "🌸", label: "Bloomed", color: "bg-pink-100 text-pink-700 border-pink-200" }
      default:
        return { emoji: "❔", label: s, color: "bg-gray-100 text-gray-700 border-gray-200" }
    }
  }
  const status = getStatusInfo(idea.stage)

  // Parse description sections
  const desc = idea.fullDescription || idea.description || "";
  const { sections, extraSections } = parseDescriptionSections(desc);

  // Load comments for this idea
  useEffect(() => {
    const loadComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_address,
          users!comments_user_address_fkey (
            bloom_username,
            wallet_address
          )
        `)
        .eq("project_id", idea.id)
        .order("created_at", { ascending: true })
      if (!error) setComments(data || [])
      // Count user's comments for this project
      if (walletAddress) {
        const userCount = (data || []).filter((c: any) => c.user_address === walletAddress).length
        setUserCommentCount(userCount)
      } else {
        setUserCommentCount(0)
      }
    }
    if (activeTab === "community") loadComments()
  }, [idea.id, activeTab, walletAddress])

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!hasVerifiedSignature || !walletAddress) {
      toast.error("Connect your wallet first")
      return
    }
    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }
    // Always use latest totalSprouts for validation
    if (totalSprouts < requiredSprouts) {
      toast.error(`You need at least ${requiredSprouts} sprouts to comment! Earn more by nurturing, planting, or joining projects.`)
      return
    }
    setSubmittingComment(true)
    try {
      // Insert comment
      const { data: comment, error: commentErr } = await supabase
        .from("comments")
        .insert({
          project_id: idea.id,
          user_address: walletAddress,
          content: newComment.trim(),
        })
        .select("id")
        .single()
      if (commentErr) throw commentErr
      // Add sprouts for commenting (category 5: neglect, positive value)
      const neglectTypeId = await getSproutTypeId('neglect')
      const { error: sproutsErr } = await supabase
        .from("sprouts")
        .insert({
          user_address: walletAddress,
          sprout_type_id: neglectTypeId,
          amount: requiredSprouts, // POSITIVE value
          related_id: comment.id,
        })
      if (!sproutsErr) {
        toast.success(`+${requiredSprouts} sprouts used to comment to reduce comments spam🌱`)
      } else {
        console.error("Failed to add neglect sprouts:", sproutsErr)
      }
      // Refresh comments and sprouts
      const { data: newComments } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_address,
          users!comments_user_address_fkey (
            bloom_username,
            wallet_address
          )
        `)
        .eq("project_id", idea.id)
        .order("created_at", { ascending: true })
      setComments(newComments || [])
      setNewComment("")
      setUserCommentCount((c) => c + 1)
      // Always refresh sprouts after addition
      await refreshSprouts()
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast.error("Failed to submit comment")
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="w-full max-w-3xl max-h-[95vh] overflow-y-auto border-emerald-100 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl">
        {/* thin gradient bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-t-2xl" />

        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-600 hover:bg-emerald-50"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="pr-12">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {/* Markdown Title */}
                <h1 className="text-3xl font-bold text-emerald-900 mb-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{p: 'span'}}>{idea.title}</ReactMarkdown>
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => onProfileClick(authorAddr)}
                    className="flex items-center gap-2 hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {/* Show bloomUsername if available, else highlight as unknown */}
                      <span className="text-xs text-emerald-500 font-semibold tracking-wide uppercase mr-1">Planted by</span>
                      <span className={`font-bold text-base rounded px-2 py-1 shadow-sm ${idea.bloomUsername ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700' : 'bg-yellow-50 text-gray-400 italic border border-yellow-200'}`}
                      >
                        {idea.bloomUsername ? `@${idea.bloomUsername}` : 'Unknown Planter'}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-emerald-600">Grove-Keeper</span>
                      </div>
                    </div>
                  </button>

                  <Badge className={`${status.color}`}>
                    {status.emoji} {status.label}
                  </Badge>

                  <div className="flex items-center gap-1 text-emerald-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(idea.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* top metrics row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.nurtureCount}</p>
                <p className="text-xs text-emerald-600/70">Garden Loves</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.joinCount}</p>
                <p className="text-xs text-emerald-600/70">Gardeners</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.commentCount}</p>
                <p className="text-xs text-emerald-600/70">Discussions</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.bloomScore||0}</p>
                <p className="text-xs text-emerald-600/70">Bloom Score</p>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-3">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                <Leaf className="w-4 h-4 mr-2" />
                Join Garden
              </Button>
              {(idea.stage === "growing" || idea.stage === "bloomed") && (
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Github className="w-4 h-4 mr-2" />
                  Repository
                </Button>
              )}
              {(idea.stage === "growing" || idea.stage === "bloomed") && (
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "progress" | "team" | "community")}>
            <TabsList className="grid w-full grid-cols-4 bg-emerald-50 rounded-xl shadow-md mb-4 overflow-hidden">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-emerald-900 transition-all rounded-none font-semibold text-emerald-700">
                🌱 Overview
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-emerald-900 transition-all rounded-none font-semibold text-emerald-700">
                📈 Progress
              </TabsTrigger>
              {(idea.stage === "growing" || idea.stage === "bloomed") && (
                <TabsTrigger value="team" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-emerald-900 transition-all rounded-none font-semibold text-emerald-700">
                  👥 Gardeners
                </TabsTrigger>
              )}
              <TabsTrigger value="community" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-emerald-900 transition-all rounded-none font-semibold text-emerald-700">
                💬 Community
              </TabsTrigger>
            </TabsList>

            {/* Overview - Sectioned Markdown */}
            <TabsContent value="overview" className="space-y-6">
              {/* Visuals Grid */}
              {visuals.length > 0 && (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {visuals.map((visual) => (
                    <div key={visual.id} className="rounded-lg overflow-hidden border border-emerald-100 bg-emerald-50 flex flex-col items-center justify-center">
                      <img
                        src={visual.url}
                        alt={visual.alt_text || "Project visual"}
                        className="object-cover w-full h-40 sm:h-48 md:h-56"
                        style={{ maxHeight: 220 }}
                      />
                      {visual.alt_text && (
                        <div className="p-2 text-xs text-emerald-700 text-center bg-emerald-50 w-full">{visual.alt_text}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Sectioned Markdown */}
              <div className="space-y-6">
                {[
                  { key: "problem", label: "What problem does your idea solve?" },
                  { key: "vision", label: "Vision" },
                  { key: "features", label: "Features" },
                  { key: "tech", label: "Tech" },
                  { key: "targetUsers", label: "Who is it for? (Target users, impact)" },
                  { key: "unique", label: "What makes it unique?" },
                ].map(({ key, label }) => (
                  <section key={key} className="bg-emerald-50/60 rounded-xl border border-emerald-100 p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">{label}</h3>
                    <div className="prose prose-emerald max-w-none text-emerald-900">
                      {sections[key] ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections[key]}</ReactMarkdown>
                      ) : (
                        <span className="text-emerald-400 italic">No content provided.</span>
                      )}
                    </div>
                  </section>
                ))}
                {/* Render any extra ## sections as their own cards */}
                {extraSections.map(({ header, content }, idx) => (
                  <section key={header + idx} className="bg-emerald-50/60 rounded-xl border border-emerald-100 p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">{header}</h3>
                    <div className="prose prose-emerald max-w-none text-emerald-900">
                      {content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                      ) : (
                        <span className="text-emerald-400 italic">No content provided.</span>
                      )}
                    </div>
                  </section>
                ))}
              </div>
              {/* Project Links */}
              {links.length > 0 && (
                <div className="mt-2">
                  <h3 className="font-semibold text-emerald-800 text-sm mb-2">Project Links</h3>
                  <ul className="space-y-2">
                    {links.map((link) => {
                      let urlObj;
                      try { urlObj = new URL(link.url); } catch { urlObj = null; }
                      const domain = urlObj ? urlObj.hostname.replace(/^www\./, "") : link.url;
                      return (
                        <li key={link.id} className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${urlObj ? urlObj.hostname : link.url}&sz=32`}
                            alt="favicon"
                            className="w-5 h-5 rounded"
                            style={{ minWidth: 20 }}
                          />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 font-medium hover:underline"
                          >
                            {link.label || domain}
                          </a>
                          <span className="ml-auto text-xs text-emerald-400">{domain}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </TabsContent>

            {/* Progress */}
            <TabsContent value="progress" className="space-y-6">
              {idea.milestones?.map((ms, i) => (
                <div key={i} className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-emerald-900">{ms.name}</h4>
                    <Badge
                      variant="outline"
                      className={
                        ms.status === "completed"
                          ? "border-green-200 text-green-700 bg-green-50"
                          : ms.status === "in-progress"
                          ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                          : "border-gray-200 text-gray-700 bg-gray-50"
                      }
                    >
                      {ms.status === "completed"
                        ? "🌸 Bloomed"
                        : ms.status === "in-progress"
                        ? "🌿 Growing"
                        : "🌱 Planted"}
                    </Badge>
                  </div>
                  <Progress value={ms.progress} className="h-2 mb-1" />
                  <p className="text-xs text-emerald-600/70 text-right">
                    {ms.progress}% • {ms.date}
                  </p>
                </div>
              ))}
            </TabsContent>

            {/* Team */}
            {(idea.stage === "growing" || idea.stage === "bloomed") && (
              <TabsContent value="team" className="space-y-6">
                {idea.team?.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {m.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-emerald-900">{m.name}</h4>
                      <p className="text-emerald-600/80">{m.role}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            )}

            {/* Community */}
            <TabsContent value="community" className="flex flex-col h-[60vh] min-h-[400px] max-h-[500px]">
              <div className="flex-1 overflow-y-auto px-2 py-4 bg-emerald-50/60 rounded-xl border border-emerald-100 mb-2 flex flex-col gap-2">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-emerald-600/70">
                    <MessageCircle className="w-8 h-8 mb-2 text-emerald-400" />
                    <p>No comments yet. Be the first to plant your thoughts!</p>
                  </div>
                ) : (
                  comments.map((comment) => {
                    const isSelf = walletAddress && comment.user_address === walletAddress
                    const authorName = comment.users?.bloom_username || `${comment.user_address.slice(0, 6)}...${comment.user_address.slice(-4)}`
                    const initials = authorName.slice(0, 2).toUpperCase()
                    const timeAgo = new Date(comment.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                    return (
                      <div key={comment.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end gap-2 max-w-[80%] ${isSelf ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">{initials}</AvatarFallback>
                          </Avatar>
                          <div className={`rounded-2xl px-4 py-2 shadow ${isSelf ? 'bg-emerald-200 text-emerald-900' : 'bg-white text-emerald-900 border border-emerald-100'}`}
                            style={{ wordBreak: 'break-word' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-xs">{authorName}</span>
                              <span className="text-xs text-emerald-400">{timeAgo}</span>
                            </div>
                            <div className="text-sm">{comment.content}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              {/* Input area sticky at bottom */}
              <div className="sticky bottom-0 bg-white/90 rounded-xl border border-emerald-100 p-3 flex flex-col gap-2 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-emerald-700 font-semibold">Sprouts required to comment: <span className="font-bold">{requiredSprouts}</span></span>
                  {totalSprouts < requiredSprouts && (
                    <span className="text-xs text-rose-500 font-semibold">Not enough sprouts</span>
                  )}
                </div>
                <div className="flex gap-2 items-end">
                  <textarea
                    placeholder={totalSprouts < requiredSprouts ? `You need more sprouts to comment!` : "Plant your thoughts..."}
                    className="flex-1 border border-emerald-200 rounded-lg p-2 min-h-[40px] max-h-[80px] resize-none bg-emerald-50 focus:bg-white focus:border-emerald-400 focus:ring-emerald-400/20 text-sm"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    disabled={submittingComment || totalSprouts < requiredSprouts}
                  />
                  <Button
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl shadow"
                    onClick={handleSubmitComment}
                    disabled={submittingComment || totalSprouts < requiredSprouts}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {submittingComment ? "Sending..." : "Send"}
                  </Button>
                </div>
                {totalSprouts < requiredSprouts && (
                  <div className="text-xs text-emerald-700 mt-1 flex items-center gap-2">
                    <span>Need more sprouts? <Link href="/" className="underline text-emerald-600">Learn how to earn</Link></span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </div>
    </div>
  )
}
