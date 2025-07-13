// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

import {
  Search,
  Sparkles,
  Leaf,
  Flower2,
  MessageCircle,
  Heart as HeartIcon,
  Slash as NeglectIcon,
  Tag as TagIcon,
  User as PersonIcon,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ProfilePopup from "@/components/profile-popup"
import EnhancedIdeaModal from "@/components/enhanced-idea-modal"
import UniversalWalletConnection from "@/components/universal-wallet-connection"
import GardenExplorer from "@/components/garden-explorer"
import {
  FloatingGardenElements,
  SeasonalBackground,
  GardenWeather,
} from "@/components/garden-elements"
import EnhancedFooter from "@/components/EnhancedFooter"

type Category = { id: number; name: string }
type CareAction = "nurture" | "neglect"

interface Project {
  id: number
  owner_address: string
  title: string
  description: string
  stage: "planted" | "growing" | "bloomed"
  created_at: string
  categoryIds: number[]
  categoryNames: string[]
  nurtureCount: number
  neglectCount: number
  commentCount: number
  joinCount: number
  userCareAction?: CareAction
  bloomUsername?: string | null
}

export default function HomePage() {
  // --- UI state ---
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<"all"|"planted"|"growing"|"bloomed">("all")
  const [tagFilter, setTagFilter] = useState<"all"|number>("all")
  const [selectedProfile, setSelectedProfile] = useState<string|null>(null)
  const [selectedIdea, setSelectedIdea] = useState<Project| null>(null)

  // --- Load everything from Supabase ---
  async function fetchData() {
    // 1) categories
    const { data: cats, error: catsErr } = await supabase
      .from('categories')
      .select('id,name')
      .order('name', { ascending: true })
    if (catsErr) {
      console.error(catsErr)
      return toast.error("Failed to load categories")
    }
    setCategories(cats)

    // 2) all the rows we'll need
    const [
      { data: prjs, error: prjErr },
      { data: pcats, error: pcErr },
      { data: cares, error: cErr },
      { data: comms, error: comErr },
      { data: joins, error: jErr },
      { data: users, error: usersErr },
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('id,owner_address,title,description,stage,created_at'),
      supabase
        .from('project_categories')
        .select('project_id,category_id'),
      supabase
        .from('project_care_actions')
        .select('project_id,action,user_address'),
      supabase
        .from('comments')
        .select('project_id'),
      supabase
        .from('join_requests')
        .select('project_id'),
      supabase
        .from('users')
        .select('wallet_address,bloom_username'),
    ])

    if (prjErr || pcErr || cErr || comErr || jErr || usersErr) {
      console.error(prjErr, pcErr, cErr, comErr, jErr, usersErr)
      return toast.error("Failed to load garden data")
    }

    // map categoryId -> name
    const catMap = new Map(categories.map((c) => [c.id, c.name]))
    // map wallet_address -> bloom_username
    const userMap = new Map((users ?? []).map((u) => [u.wallet_address, u.bloom_username]))

    // build full projects array
    const enriched = (prjs ?? []).map((p) => {
      const myCats = (pcats ?? []).filter((x) => x.project_id === p.id)
      const careRows = (cares ?? []).filter((x) => x.project_id === p.id)
      const userRow = careRows.find((x) => x.user_address === walletAddress)

      const nCount = careRows.filter((x) => x.action === "nurture").length
      const xCount = careRows.filter((x) => x.action === "neglect").length
      const cmCount = (comms ?? []).filter((x) => x.project_id === p.id).length
      const jnCount = (joins ?? []).filter((x) => x.project_id === p.id).length

      const catIds = myCats.map((x) => x.category_id)
      const catNames = catIds.map((id) => catMap.get(id) ?? "unknown")
      const bloomUsername = userMap.get(p.owner_address) || null

      return {
        ...p,
        categoryIds: catIds,
        categoryNames: catNames,
        nurtureCount: nCount,
        neglectCount: xCount,
        commentCount: cmCount,
        joinCount: jnCount,
        userCareAction: userRow?.action,
        bloomUsername,
      }
    })

    setProjects(enriched)
  }

  // initial load & reload whenever wallet changes
  useEffect(() => {
    fetchData()
  }, [walletAddress])

  // --- care toggle ---
  async function handleCare(projId: number, action: CareAction) {
    if (!walletAddress) {
      return toast.error("Connect your wallet first")
    }
    // check existing row
    const existing = projects.find((p) => p.id === projId)?.userCareAction
    if (existing === action) {
      // delete
      await supabase
        .from("project_care_actions")
        .delete()
        .match({ project_id: projId, user_address: walletAddress })
    } else {
      // upsert
      await supabase
        .from("project_care_actions")
        .upsert(
          { project_id: projId, user_address: walletAddress, action },
          { onConflict: ["project_id", "user_address"] }
        )
    }
    fetchData()
  }

  // --- filtering ---
  const filtered = projects
    .filter((p) => stageFilter === "all" || p.stage === stageFilter)
    .filter((p) =>
      tagFilter === "all" ? true : p.categoryIds.includes(tagFilter as number)
    )
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="min-h-screen relative">
      <SeasonalBackground season="spring" />
      <FloatingGardenElements />

      {/* ================= HEADER (unchanged) ================= */}
      <header className="border-b border-emerald-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-emerald-500" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Bloom Ideas
              </h1>
              <p className="text-sm text-emerald-600/70">
                Where hackathon ideas flourish 🌸
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UniversalWalletConnection
              onConnectionChange={(conn, addr) =>
                conn ? setWalletAddress(addr!) : setWalletAddress("")
              }
            />
            {walletAddress && <GardenExplorer walletAddress={walletAddress} />}
            <Link href="/submit">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <Leaf className="w-4 h-4 mr-1" /> Plant Idea
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* — Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-emerald-700 font-medium">
              Cultivating Innovation 🌱
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Digital Garden of Ideas
          </h2>
          <p className="text-xl text-emerald-700/80 max-w-2xl mx-auto mb-6">
            Plant your ideas, watch them grow, and harvest the future of Web3
            innovation together. 🌻
          </p>
          <div className="max-w-md mx-auto mb-8">
            <GardenWeather />
          </div>

          {/* — Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            <Input
              placeholder="Search gardens... 🔍"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-400"
            />
          </div>

          {/* — Stage Filters */}
          <div className="flex justify-center gap-3 mb-4">
            {(["all", "planted", "growing", "bloomed"] as any[]).map((stg) => (
              <Button
                key={stg}
                variant={stageFilter === stg ? "default" : "outline"}
                onClick={() => setStageFilter(stg)}
              >
                {{
                  all: "🌻 All Gardens",
                  planted: "🌱 Planted Seeds",
                  growing: "🌿 Growing",
                  bloomed: "🌸 Bloomed",
                }[stg]}
              </Button>
            ))}
          </div>

          {/* — Category Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={tagFilter === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setTagFilter("all")}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                variant={tagFilter === c.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTagFilter(c.id)}
              >
                {c.name}
              </Button>
            ))}
          </div>

          <p className="text-center text-emerald-600/70 mb-6">
            🌺 Found {filtered.length} beautiful garden
            {filtered.length !== 1 ? "s" : ""} 🌺
          </p>
        </div>

        {/* — Garden Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((idea) => (
            <div
              key={idea.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-emerald-900">
                    {idea.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      {
                        planted: "bg-yellow-100 text-yellow-700",
                        growing: "bg-emerald-100 text-emerald-700",
                        bloomed: "bg-pink-100 text-pink-700",
                      }[idea.stage]
                    }`}
                  >
                    {idea.stage}
                  </span>
                </div>
                {/* Owner username display */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-emerald-500 font-semibold tracking-wide uppercase mr-1">Planted by</span>
                  <span className={`font-bold text-base rounded px-2 py-1 shadow-sm ${idea.bloomUsername ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700' : 'bg-yellow-50 text-gray-400 italic border border-yellow-200'}`}
                  >
                    {idea.bloomUsername ? `@${idea.bloomUsername}` : 'Unknown Planter'}
                  </span>
                </div>

                <div className="prose prose-emerald line-clamp-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {idea.description}
                  </ReactMarkdown>
                </div>

                <div className="flex flex-wrap gap-2">
                  {idea.categoryNames.map((cat) => (
                    <span
                      key={cat}
                      className="flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs"
                    >
                      <TagIcon className="w-3 h-3 mr-1" /> {cat}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm mt-3">
                  <button
                    onClick={() => handleCare(idea.id, "nurture")}
                    title="🌱 Nurture this garden"
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-600 transition"
                  >
                    <HeartIcon size={16} /> {idea.nurtureCount}
                  </button>
                  <button
                    onClick={() => handleCare(idea.id, "neglect")}
                    title="❌ Neglect this garden"
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-600 transition"
                  >
                    <NeglectIcon size={16} /> {idea.neglectCount}
                  </button>
                  <div className="flex items-center gap-1 text-blue-500">
                    <PersonIcon size={16} /> {idea.joinCount}
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <MessageCircle size={16} /> {idea.commentCount}
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedIdea(idea)}
                  className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                >
                  ✨ Explore Garden
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <EnhancedFooter />

      {/* ================= POPUPS ================= */}
      {selectedProfile && (
        <ProfilePopup
          address={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
      {selectedIdea && (
        <EnhancedIdeaModal
          idea={{ ...selectedIdea, bloomUsername: selectedIdea.bloomUsername || "" }}
          onClose={() => setSelectedIdea(null)}
          onProfileClick={(addr) => setSelectedProfile(addr)}
        />
      )}
    </div>
  )
}
