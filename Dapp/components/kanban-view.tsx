"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Users, Sparkles, Leaf, Plus } from "lucide-react"

const mockIdeas = {
  ideas: [
    {
      id: 1,
      title: "DeFi Garden Protocol",
      description: "A yield farming protocol that grows your assets like a digital garden.",
      author: "0x1234...5678",
      tags: ["DeFi", "Yield Farming"],
      votes: 42,
      interested: 8,
      status: "idea",
    },
    {
      id: 2,
      title: "ZK Bloom Verification",
      description: "Zero-knowledge proof system for private credential verification.",
      author: "0x9876...5432",
      tags: ["ZK", "Privacy"],
      votes: 38,
      interested: 12,
      status: "idea",
    },
  ],
  "in-progress": [
    {
      id: 3,
      title: "NFT Seed Exchange",
      description: "Marketplace for trading rare digital seeds that grow into unique NFT artworks.",
      author: "0x5555...7777",
      tags: ["NFT", "Marketplace"],
      votes: 29,
      interested: 6,
      status: "in-progress",
      progress: 65,
    },
    {
      id: 4,
      title: "Cross-Chain Garden Bridge",
      description: "Bridge protocol for transferring assets between different blockchains.",
      author: "0x3333...4444",
      tags: ["DeFi", "Cross-Chain"],
      votes: 35,
      interested: 9,
      status: "in-progress",
      progress: 40,
    },
  ],
  completed: [
    {
      id: 5,
      title: "Garden Governance DAO",
      description: "Decentralized governance platform for community decision making.",
      author: "0x7777...8888",
      tags: ["DAO", "Governance"],
      votes: 56,
      interested: 15,
      status: "completed",
      deployedUrl: "https://garden-dao.xyz",
    },
  ],
}

const columns = [
  {
    id: "ideas",
    title: "🌱 Planted Ideas",
    description: "Fresh ideas waiting to bloom",
    color: "border-yellow-200 bg-yellow-50",
    headerColor: "bg-yellow-100",
  },
  {
    id: "in-progress",
    title: "🌿 Growing",
    description: "Ideas currently being developed",
    color: "border-blue-200 bg-blue-50",
    headerColor: "bg-blue-100",
  },
  {
    id: "completed",
    title: "🌸 Bloomed",
    description: "Successfully launched projects",
    color: "border-green-200 bg-green-50",
    headerColor: "bg-green-100",
  },
]

interface KanbanViewProps {
  onIdeaClick?: (idea: any) => void
}

export default function KanbanView({ onIdeaClick }: KanbanViewProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <Card className={`${column.color} border-2`}>
            <CardHeader className={`${column.headerColor} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-emerald-900">{column.title}</h3>
                  <p className="text-sm text-emerald-700/70">{column.description}</p>
                </div>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  {mockIdeas[column.id as keyof typeof mockIdeas].length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {mockIdeas[column.id as keyof typeof mockIdeas].map((idea: any) => (
                <Card
                  key={idea.id}
                  className="border-emerald-100 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm"
                  onClick={() => onIdeaClick?.(idea)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                          {idea.title}
                        </h4>
                        {idea.status === "completed" && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">✨ Live</Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-emerald-800/80 line-clamp-2">{idea.description}</p>

                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                            {idea.author.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-emerald-600/70">builder.eth</span>
                        <div className="ml-auto flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          <span className="text-xs text-emerald-600">Grove-Keeper</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Progress Bar (for in-progress items) */}
                      {idea.status === "in-progress" && (
                        <div>
                          <div className="flex justify-between text-xs text-emerald-600/70 mb-1">
                            <span>Development Progress</span>
                            <span>{idea.progress}%</span>
                          </div>
                          <div className="w-full bg-emerald-100 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-emerald-400 to-green-500 h-1.5 rounded-full"
                              style={{ width: `${idea.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-emerald-600">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-500" />
                            <span>{idea.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-blue-500" />
                            <span>{idea.interested}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-green-500" />
                            <span>5</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent h-6 px-2 text-xs"
                        >
                          {idea.status === "completed" ? (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" />
                              View Live
                            </>
                          ) : (
                            <>
                              <Leaf className="w-3 h-3 mr-1" />
                              View
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Card */}
              <Card className="border-2 border-dashed border-emerald-200 hover:border-emerald-300 transition-colors cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2 text-emerald-600 group-hover:text-emerald-700">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm font-medium">
                      {column.id === "ideas"
                        ? "Plant New Idea"
                        : column.id === "in-progress"
                          ? "Start Building"
                          : "Mark Complete"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
