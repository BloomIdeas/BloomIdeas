"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import ReactMarkdown from "react-markdown"

interface EnhancedIdeaModalProps {
  idea: any
  onClose: () => void
  onProfileClick: (address: string) => void
}

const mockDetailedIdea = {
  fullDescription: `# 🌱 DeFi Garden Protocol

## Vision
Transform traditional DeFi into an intuitive, garden-inspired experience where users can plant, nurture, and harvest their digital assets.

## 🔧 Core Features

### Smart Garden Mechanics
- **Seed Planting**: Deposit tokens to start your yield farming journey
- **Growth Tracking**: Real-time visualization of investment growth  
- **Harvest Rewards**: Automated reward distribution with bonus multipliers
- **Companion Planting**: Combine different tokens for enhanced yields

### Garden Tools
- **Watering System**: Stake additional tokens to boost growth rates
- **Fertilizer**: Use governance tokens to accelerate reward cycles
- **Weather Forecast**: Predictive analytics for optimal planting times
- **Garden Journal**: Track your farming history and performance

## 🛠 Technical Architecture

### Smart Contracts
- **GardenCore.sol**: Main protocol logic and yield calculations
- **SeedVault.sol**: Secure token storage and management  
- **SeasonManager.sol**: Time-based reward modifiers
- **CommunityGarden.sol**: Shared pool management

### Frontend Experience
- **3D Garden Visualization**: Watch your investments grow in real-time
- **Intuitive Interface**: Garden metaphors make DeFi accessible
- **Mobile-First Design**: Tend your garden anywhere, anytime
- **Social Features**: Share gardens and learn from other farmers

## 🌍 Roadmap

### Phase 1: Seedling (Q2 2024)
- [ ] Core smart contracts deployment
- [ ] Basic garden interface
- [ ] Community testing program

### Phase 2: Growth (Q3 2024)  
- [ ] Advanced garden tools
- [ ] Multi-chain expansion
- [ ] Mobile app launch

### Phase 3: Bloom (Q4 2024)
- [ ] DAO governance launch
- [ ] NFT garden collectibles
- [ ] Institutional partnerships

## 🤝 Join Our Garden

We're building more than a protocol - we're cultivating a community of digital gardeners who believe DeFi should be beautiful, intuitive, and rewarding for everyone.`,

  milestones: [
    { name: "Smart Contract Development", status: "completed", progress: 100, date: "Dec 2023" },
    { name: "Garden UI Design", status: "completed", progress: 100, date: "Jan 2024" },
    { name: "Security Audit", status: "in-progress", progress: 75, date: "Feb 2024" },
    { name: "Testnet Launch", status: "pending", progress: 0, date: "Mar 2024" },
  ],

  team: [
    { name: "Alice Green", role: "Lead Gardener", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Bob Forest", role: "Smart Contract Architect", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Carol Bloom", role: "Garden Designer", avatar: "/placeholder.svg?height=40&width=40" },
  ],

  techStack: ["Solidity", "React", "Three.js", "Node.js", "IPFS", "The Graph"],
  chains: ["Ethereum", "Polygon", "Arbitrum"],
}

const mockComments = [
  {
    id: 1,
    author: "0x9999...1111",
    authorName: "CryptoFarmer",
    content:
      "This garden metaphor is brilliant! Finally, DeFi that my grandmother could understand. The 3D visualization idea is game-changing.",
    createdAt: "2 hours ago",
    votes: 12,
  },
  {
    id: 2,
    author: "0x8888...2222",
    authorName: "YieldHunter",
    content:
      "Love the companion planting concept. Combining different tokens for enhanced yields is exactly what the space needs. When's the testnet?",
    createdAt: "5 hours ago",
    votes: 8,
  },
]

export default function EnhancedIdeaModal({ idea, onClose, onProfileClick }: EnhancedIdeaModalProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [isInterested, setIsInterested] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "planted":
        return { emoji: "🌱", label: "Planted", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
      case "growing":
        return { emoji: "🌿", label: "Growing", color: "bg-green-100 text-green-700 border-green-200" }
      case "bloomed":
        return { emoji: "🌸", label: "Bloomed", color: "bg-pink-100 text-pink-700 border-pink-200" }
      default:
        return { emoji: "🌱", label: "Planted", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
    }
  }

  const statusInfo = getStatusInfo(idea.status)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto border-emerald-100 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
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
                <h1 className="text-3xl font-bold text-emerald-900 mb-3">{idea.title}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => onProfileClick(idea.author)}
                    className="flex items-center gap-2 hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {idea.author.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-emerald-800">builder.eth</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        <span className="text-xs text-emerald-600">Grove-Keeper</span>
                      </div>
                    </div>
                  </button>
                  <Badge className={statusInfo.color}>
                    {statusInfo.emoji} {statusInfo.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{idea.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Garden Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.votes}</p>
                <p className="text-xs text-emerald-600/70">Garden Loves</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.interested}</p>
                <p className="text-xs text-emerald-600/70">Gardeners</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{mockComments.length}</p>
                <p className="text-xs text-emerald-600/70">Discussions</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.bloomScore || 85}</p>
                <p className="text-xs text-emerald-600/70">Bloom Score</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className={`${hasVoted ? "bg-rose-500 hover:bg-rose-600" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"} text-white`}
                onClick={() => setHasVoted(!hasVoted)}
              >
                <Heart className={`w-4 h-4 mr-2 ${hasVoted ? "fill-current" : ""}`} />
                {hasVoted ? "Loved!" : "Love This Garden"}
              </Button>
              <Button
                variant="outline"
                className={`${isInterested ? "border-green-500 text-green-700 bg-green-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                onClick={() => setIsInterested(!isInterested)}
              >
                <Leaf className="w-4 h-4 mr-2" />
                {isInterested ? "Growing This!" : "Join Garden"}
              </Button>
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <Github className="w-4 h-4 mr-2" />
                Repository
              </Button>
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card className="border-emerald-100">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-emerald-900">🌿 Garden Blueprint</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-emerald max-w-none">
                        <ReactMarkdown>{mockDetailedIdea.fullDescription}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {/* Tech Garden */}
                  <Card className="border-emerald-100">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-emerald-900">🛠 Garden Tools</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {mockDetailedIdea.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="border-emerald-200 text-emerald-700">
                            <Code className="w-3 h-3 mr-1" />
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Garden Locations */}
                  <Card className="border-emerald-100">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-emerald-900">🌍 Garden Locations</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mockDetailedIdea.chains.map((chain) => (
                          <div key={chain} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                            <Zap className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-800 font-medium">{chain}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card className="border-emerald-100">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-emerald-900">🎯 Garden Growth Milestones</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDetailedIdea.milestones.map((milestone, index) => (
                      <div key={index} className="bg-emerald-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-emerald-900">{milestone.name}</h4>
                          <Badge
                            variant="outline"
                            className={
                              milestone.status === "completed"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : milestone.status === "in-progress"
                                  ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                  : "border-gray-200 text-gray-700 bg-gray-50"
                            }
                          >
                            {milestone.status === "completed"
                              ? "🌸 Bloomed"
                              : milestone.status === "in-progress"
                                ? "🌿 Growing"
                                : "🌱 Planted"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-600/70 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{milestone.date}</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                        <div className="text-right text-xs text-emerald-600/70 mt-1">
                          {milestone.progress}% complete
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card className="border-emerald-100">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-emerald-900">👥 Garden Team</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mockDetailedIdea.team.map((member, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-emerald-900">{member.name}</h4>
                          <p className="text-emerald-700/80">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <Card className="border-emerald-100">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-emerald-900">💬 Garden Discussions</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about this garden..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                    />
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Plant Your Thoughts
                    </Button>
                  </div>

                  {/* Comments */}
                  <div className="space-y-4">
                    {mockComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-l-4 border-emerald-200 pl-4 py-3 bg-emerald-50/50 rounded-r-lg"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                              {comment.authorName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-emerald-800">{comment.authorName}</span>
                          <span className="text-sm text-emerald-600/70">•</span>
                          <span className="text-sm text-emerald-600/70">{comment.createdAt}</span>
                        </div>
                        <p className="text-emerald-800/90 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 h-7 px-2">
                            <Heart className="w-3 h-3 mr-1" />
                            {comment.votes}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 h-7 px-2">
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
