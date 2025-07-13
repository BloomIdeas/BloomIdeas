"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Leaf, Flower2 } from "lucide-react"
import Link from "next/link"
import ProfilePopup from "@/components/profile-popup"
import EnhancedIdeaModal from "@/components/enhanced-idea-modal"
import SimplifiedIdeaCard from "@/components/simplified-idea-card"
import UniversalWalletConnection from "@/components/universal-wallet-connection"
import GardenExplorer from "@/components/garden-explorer"
import { FloatingGardenElements, SeasonalBackground, GardenWeather } from "@/components/garden-elements"
import EnhancedFooter from "@/components/EnhancedFooter"

const mockIdeas = [
  {
    id: 1,
    title: "DeFi Garden Protocol",
    description:
      "A yield farming protocol that grows your assets like a digital garden. Plant tokens, nurture with liquidity, and harvest rewards.",
    author: "0x1234...5678",
    tags: ["DeFi", "Yield Farming", "Protocol", "Governance"],
    votes: 42,
    interested: 8,
    comments: 12,
    status: "growing",
    createdAt: "2 days ago",
    bloomScore: 92,
  },
  {
    id: 2,
    title: "ZK Bloom Verification",
    description:
      "Zero-knowledge proof system for private credential verification with beautiful UI inspired by blooming flowers.",
    author: "0x9876...5432",
    tags: ["ZK", "Privacy", "Identity"],
    votes: 38,
    interested: 12,
    comments: 8,
    status: "planted",
    createdAt: "1 day ago",
    bloomScore: 87,
  },
  {
    id: 3,
    title: "NFT Seed Exchange",
    description: "Marketplace for trading rare digital seeds that grow into unique NFT artworks over time.",
    author: "0x5555...7777",
    tags: ["NFT", "Marketplace", "Art"],
    votes: 29,
    interested: 6,
    comments: 5,
    status: "planted",
    createdAt: "3 hours ago",
    bloomScore: 78,
  },
  {
    id: 4,
    title: "Garden Governance DAO",
    description:
      "Decentralized governance platform for community decision making with garden-themed voting mechanisms.",
    author: "0x7777...8888",
    tags: ["DAO", "Governance", "Community"],
    votes: 56,
    interested: 15,
    comments: 18,
    status: "bloomed",
    createdAt: "1 week ago",
    bloomScore: 95,
  },
  {
    id: 5,
    title: "Cross-Chain Garden Bridge",
    description: "Bridge protocol for transferring assets between different blockchains with garden-themed interface.",
    author: "0x3333...4444",
    tags: ["DeFi", "Cross-Chain", "Bridge"],
    votes: 35,
    interested: 9,
    comments: 7,
    status: "growing",
    createdAt: "4 days ago",
    bloomScore: 83,
  },
  {
    id: 6,
    title: "Bloom Social Network",
    description: "Decentralized social platform where connections grow like a garden ecosystem.",
    author: "0x6666...9999",
    tags: ["Social", "Web3", "Community"],
    votes: 24,
    interested: 11,
    comments: 9,
    status: "bloomed",
    createdAt: "2 weeks ago",
    bloomScore: 89,
  },
]

const filterOptions = [
  { id: "all", label: "🌻 All Gardens", emoji: "🌻" },
  { id: "planted", label: "🌱 Planted Seeds", emoji: "🌱" },
  { id: "growing", label: "🌿 Growing", emoji: "🌿" },
  { id: "bloomed", label: "🌸 Bloomed", emoji: "🌸" },
]

const tags = ["All", "DeFi", "ZK", "NFT", "AI", "DAO", "Social", "Gaming"]

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedTag, setSelectedTag] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<any>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleWalletConnectionChange = (connected: boolean, address?: string) => {
    setIsWalletConnected(connected)
    setWalletAddress(address || "")
  }

  const filteredIdeas = mockIdeas.filter((idea) => {
    const matchesFilter = selectedFilter === "all" || idea.status === selectedFilter
    const matchesTag = selectedTag === "All" || idea.tags.includes(selectedTag)
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesTag && matchesSearch
  })

  return (
    <div className="min-h-screen relative">
      {/* Seasonal Background */}
      <SeasonalBackground season="spring" />

      {/* Floating Garden Elements */}
      <FloatingGardenElements />

      {/* Header */}
      <header className="border-b border-emerald-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/Logo-bloomideas.png" alt="Bloom Ideas Logo" className="w-10 h-10 rounded-full shadow" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Bloom Ideas
                </h1>
                <p className="text-sm text-emerald-600/70">Where hackathon ideas flourish 🌸</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UniversalWalletConnection onConnectionChange={handleWalletConnectionChange} />

              {isWalletConnected && <GardenExplorer walletAddress={walletAddress} />}

              <Link href="/submit">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  <Leaf className="w-4 h-4 mr-2" />
                  Plant Idea
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-emerald-700 font-medium">Cultivating Innovation 🌱</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Digital Garden of Ideas
          </h2>
          <p className="text-xl text-emerald-700/80 max-w-2xl mx-auto mb-6">
            Plant your ideas, watch them grow, and harvest the future of Web3 innovation together. 🌻
          </p>

          {/* Garden Weather Widget */}
          <div className="max-w-md mx-auto mb-8">
            <GardenWeather />
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
          <Input
            placeholder="Search gardens... 🔍"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Garden Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filterOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter.id)}
              className={
                selectedFilter === filter.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm"
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className={
                selectedTag === tag
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm"
              }
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Results Count with Garden Emoji */}
        <div className="text-center mb-6">
          <p className="text-emerald-600/70">
            🌺 Found {filteredIdeas.length} beautiful garden{filteredIdeas.length !== 1 ? "s" : ""}
            {selectedFilter !== "all" &&
              ` in ${filterOptions.find((f) => f.id === selectedFilter)?.label.toLowerCase()}`}{" "}
            🌺
          </p>
        </div>

        {/* Ideas Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredIdeas.map((idea) => (
            <SimplifiedIdeaCard
              key={idea.id}
              idea={idea}
              onViewDetails={setSelectedIdea}
              onProfileClick={setSelectedProfile}
            />
          ))}
        </div>

        {/* Load More */}
        {filteredIdeas.length > 0 && (
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Discover More Gardens 🌻
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Flower2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">No Gardens Found 🌱</h3>
            <p className="text-emerald-600/70 mb-6">
              The garden is waiting for your seeds! Plant the first idea in this category! 🌸
            </p>
            <Link href="/submit">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                <Leaf className="w-4 h-4 mr-2" />
                Plant First Seed 🌱
              </Button>
            </Link>
          </div>
        )}

        {/* Enhanced Footer */}
        <EnhancedFooter />
      </main>

      {selectedProfile && <ProfilePopup address={selectedProfile} onClose={() => setSelectedProfile(null)} />}
      {selectedIdea && (
        <EnhancedIdeaModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onProfileClick={setSelectedProfile}
        />
      )}
    </div>
  )
}
