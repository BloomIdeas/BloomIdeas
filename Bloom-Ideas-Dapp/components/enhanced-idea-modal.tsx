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
}

export default function EnhancedIdeaModal({
  idea,
  onClose,
  onProfileClick,
}: EnhancedIdeaModalProps) {
  const [activeTab, setActiveTab] = useState<"overview"|"progress"|"team"|"community">("overview")

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto border-emerald-100 bg-white/95 backdrop-blur-sm">
        {/* thin gradient bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400" />

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
                <h1 className="text-3xl font-bold text-emerald-900 mb-3">
                  {idea.title}
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
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <Github className="w-4 h-4 mr-2" />
                Repository
              </Button>
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "progress" | "team" | "community")}>
            <TabsList className="grid w-full grid-cols-4 bg-emerald-50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                🌱 Overview
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-white">
                📈 Progress
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-white">
                👥 Gardeners
              </TabsTrigger>
              <TabsTrigger value="community" className="data-[state=active]:bg-white">
                💬 Community
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="prose prose-emerald max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {idea.fullDescription || idea.description}
                </ReactMarkdown>
              </div>
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

            {/* Community */}
            <TabsContent value="community" className="space-y-6">
              <div className="space-y-3">
                <textarea
                  placeholder="Plant your thoughts..."
                  className="w-full border border-emerald-200 rounded-lg p-2"
                />
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <Send className="w-4 h-4 mr-2" /> Send Comment
                </Button>
              </div>
              {/* you’d map actual comments here */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
