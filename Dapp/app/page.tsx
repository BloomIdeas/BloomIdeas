"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Users, Search, Sparkles, Leaf, Flower2 } from "lucide-react"
import Link from "next/link"
import ProfilePopup from "@/components/profile-popup"
import IdeaDetailModal from "@/components/idea-detail-modal"
import KanbanView from "@/components/kanban-view"
import WalletConnection from "@/components/wallet-connection"
import Image from "next/image"

const mockIdeas = [
  {
    id: 1,
    title: "DeFi Garden Protocol",
    description:
      "A yield farming protocol that grows your assets like a digital garden. Plant tokens, nurture with liquidity, and harvest rewards.",
    author: "0x1234...5678",
    tags: ["DeFi", "Yield Farming", "Protocol"],
    votes: 42,
    interested: 8,
    status: "approved",
    createdAt: "2 days ago",
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
    status: "approved",
    createdAt: "1 day ago",
  },
  {
    id: 3,
    title: "NFT Seed Exchange",
    description: "Marketplace for trading rare digital seeds that grow into unique NFT artworks over time.",
    author: "0x5555...7777",
    tags: ["NFT", "Marketplace", "Art"],
    votes: 29,
    interested: 6,
    status: "approved",
    createdAt: "3 hours ago",
  },
]

const tags = ["All", "DeFi", "ZK", "NFT", "AI", "Tooling", "SDK", "Gaming", "Social"]

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("grid")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-emerald-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Image src="/Logo-bloomideas.png" alt="Bloom Ideas Logo" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Bloom Ideas
                </h1>
                <p className="text-sm text-emerald-600/70">Where hackathon ideas flourish</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <WalletConnection />
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

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Cultivating Innovation</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Invisible Gardens of Ideas
          </h2>
          <p className="text-xl text-emerald-700/80 max-w-2xl mx-auto">
            Discover, nurture, and grow the next generation of Web3 innovations in our digital garden of possibilities.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <Input
              placeholder="Search ideas in the garden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={
                  selectedTag === tag
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTag === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("All")}
                className={
                  selectedTag === "All"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }
              >
                🔥 Hot
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                🌱 New
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                🚀 Trending
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              }
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              }
            >
              List
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className={
                viewMode === "kanban"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              }
            >
              Kanban
            </Button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "kanban" ? (
          <KanbanView onIdeaClick={setSelectedIdea} />
        ) : (
          <>
            {/* Enhanced Ideas Grid */}
            <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {mockIdeas.map((idea) => (
                <Card
                  key={idea.id}
                  className="group hover:shadow-2xl transition-all duration-500 border-emerald-100 hover:border-emerald-300 bg-white/90 backdrop-blur-sm overflow-hidden hover:scale-[1.02] cursor-pointer"
                >
                  <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-100 text-green-700 border-green-200">🌱 Growing</Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/idea/${idea.id}`}>
                          <h3 className="font-bold text-lg text-emerald-900 group-hover:text-emerald-700 transition-colors cursor-pointer mb-2">
                            {idea.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            onClick={() => setSelectedProfile(idea.author)}
                            className="flex items-center gap-2 hover:bg-emerald-50 rounded-lg p-1 transition-colors"
                          >
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                                {idea.author.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-emerald-800">builder.eth</span>
                              <span className="text-xs text-emerald-600/70">{idea.author}</span>
                            </div>
                          </button>
                          <div className="ml-auto flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span className="text-xs text-emerald-600">Grove-Keeper</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-emerald-800/80 mb-4 line-clamp-3">{idea.description}</p>

                    {/* Tech Stack Preview */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                        Solidity
                      </Badge>
                      <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs">
                        React
                      </Badge>
                      <Badge variant="outline" className="border-orange-200 text-orange-700 text-xs">
                        IPFS
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {idea.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Enhanced Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-emerald-600">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span className="font-medium">{idea.votes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{idea.interested}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                      <div className="text-xs text-emerald-600/70">🔥 Hot Score: 89</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-emerald-600/70 mb-1">
                        <span>Development Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-emerald-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedIdea(idea)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        View Garden
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                      >
                        <Leaf className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <Leaf className="w-4 h-4 mr-2" />
                Discover More Ideas
              </Button>
            </div>
          </>
        )}

        {/* Simplified Footer */}
        <footer className="mt-20 border-t border-emerald-200/50 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Image src="/Logo-bloomideas.png" alt="Bloom Ideas Logo" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h3 className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Bloom Ideas
                  </h3>
                  <p className="text-xs text-emerald-600/70">Where ideas flourish</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <a
                  href="mailto:hello@bloomideas.garden"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/bloomideas"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/bloom_ideas"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>

              <p className="text-emerald-600/70 text-sm flex items-center gap-1">
                Made with 💚 by
                <a
                  href="https://twitter.com/pranshurastogii"
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  @pranshurastogii
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {selectedProfile && <ProfilePopup address={selectedProfile} onClose={() => setSelectedProfile(null)} />}
      {selectedIdea && <IdeaDetailModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />}
    </div>
  )
}
