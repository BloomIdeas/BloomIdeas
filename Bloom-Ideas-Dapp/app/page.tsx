// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const isMobile = useIsMobile()

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
          { onConflict: "project_id,user_address" }
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

  const stageLabels = {
    all: "🌻 All Gardens",
    planted: "🌱 Planted Seeds",
    growing: "🌿 Growing",
    bloomed: "🌸 Bloomed",
  } as const

  return (
    <div className="min-h-screen relative">
      <SeasonalBackground season="spring" />
      <FloatingGardenElements />

      {/* ================= HEADER ================= */}
      <header className="border-b border-emerald-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
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

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flower2 className="w-6 h-6 text-emerald-500" />
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Bloom Ideas
                </h1>
                <p className="text-xs text-emerald-600/70">
                  Where ideas flourish 🌸
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/submit">
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <Leaf className="w-3 h-3 mr-1" /> Plant
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 p-4 bg-white/95 rounded-lg border border-emerald-200">
              <div className="space-y-3">
                <UniversalWalletConnection
                  onConnectionChange={(conn, addr) =>
                    conn ? setWalletAddress(addr!) : setWalletAddress("")
                  }
                />
                {walletAddress && <GardenExplorer walletAddress={walletAddress} />}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        {/* — Hero */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 animate-pulse" />
            <span className="text-sm md:text-base text-emerald-700 font-medium">
              Cultivating Innovation 🌱
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Digital Garden of Ideas
          </h2>
          <p className="text-base md:text-xl text-emerald-700/80 max-w-2xl mx-auto mb-4 md:mb-6 px-4">
            Plant your ideas, watch them grow, and harvest the future of Web3
            innovation together. 🌻
          </p>
          <div className="max-w-md mx-auto mb-6 md:mb-8">
            <GardenWeather />
          </div>

          {/* — Search */}
          <div className="relative max-w-md mx-auto mb-6 md:mb-8 px-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />
            <Input
              placeholder="Search gardens... 🔍"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-400"
            />
          </div>

          {/* — Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full max-w-md"
            >
              {showFilters ? "Hide Filters" : "Show Filters"} 🔍
            </Button>
          </div>

          {/* — Stage Filters */}
          <div className={`${isMobile && !showFilters ? 'hidden' : ''} flex flex-wrap justify-center gap-2 md:gap-3 mb-4 px-4`}>
            {(["all", "planted", "growing", "bloomed"] as const).map((stg) => (
              <Button
                key={stg}
                variant={stageFilter === stg ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                onClick={() => setStageFilter(stg)}
                className="text-xs md:text-sm"
              >
                {stageLabels[stg]}
              </Button>
            ))}
          </div>

          {/* — Category Tags */}
          <div className={`${isMobile && !showFilters ? 'hidden' : ''} flex flex-wrap justify-center gap-2 mb-6 md:mb-8 px-4`}>
            <Button
              variant={tagFilter === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setTagFilter("all")}
              className="text-xs"
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                variant={tagFilter === c.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTagFilter(c.id)}
                className="text-xs"
              >
                {c.name}
              </Button>
            ))}
          </div>

          <p className="text-center text-emerald-600/70 mb-4 md:mb-6 text-sm md:text-base">
            🌺 Found {filtered.length} beautiful garden
            {filtered.length !== 1 ? "s" : ""} 🌺
          </p>
        </div>

        {/* — Garden Cards Grid */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((idea) => (
            <div
              key={idea.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-base md:text-lg font-semibold text-emerald-900 flex-1">
                    {idea.title}
                  </h3>
                  <span
                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
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
                  <span className="text-xs text-emerald-500 font-semibold tracking-wide uppercase">Planted by</span>
                  <span className={`font-bold text-sm md:text-base rounded px-2 py-1 shadow-sm ${idea.bloomUsername ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700' : 'bg-yellow-50 text-gray-400 italic border border-yellow-200'}`}
                  >
                    {idea.bloomUsername ? `@${idea.bloomUsername}` : 'Unknown Planter'}
                  </span>
                </div>

                <div className="prose prose-emerald line-clamp-3 text-sm md:text-base">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {idea.description}
                  </ReactMarkdown>
                </div>

                <div className="flex flex-wrap gap-1 md:gap-2">
                  {idea.categoryNames.map((cat) => (
                    <span
                      key={cat}
                      className="flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs"
                    >
                      <TagIcon className="w-3 h-3 mr-1" /> {cat}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm mt-3">
                  <div className="flex items-center gap-3 md:gap-6">
                    <button
                      onClick={() => handleCare(idea.id, "nurture")}
                      title="🌱 Nurture this garden"
                      className="flex items-center gap-1 text-rose-500 hover:text-rose-600 transition p-1 rounded"
                    >
                      <HeartIcon size={16} /> {idea.nurtureCount}
                    </button>
                    <button
                      onClick={() => handleCare(idea.id, "neglect")}
                      title="❌ Neglect this garden"
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-600 transition p-1 rounded"
                    >
                      <NeglectIcon size={16} /> {idea.neglectCount}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-1 text-blue-500">
                      <PersonIcon size={16} /> {idea.joinCount}
                    </div>
                    <div className="flex items-center gap-1 text-green-500">
                      <MessageCircle size={16} /> {idea.commentCount}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedIdea(idea)}
                  className="w-full mt-3 md:mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm md:text-base py-2 md:py-3"
                >
                  ✨ Explore Garden
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-emerald-700 mb-2">No gardens found</h3>
            <p className="text-emerald-600/70 mb-4">
              Try adjusting your search or filters to find more ideas
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setStageFilter("all")
                setTagFilter("all")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
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
