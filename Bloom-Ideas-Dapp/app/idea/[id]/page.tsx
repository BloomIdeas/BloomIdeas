"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageCircle,
  Users,
  ArrowLeft,
  Github,
  Flower2,
  Leaf,
  Sparkles,
  ExternalLink,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import ProfilePopup from "@/components/profile-popup"

const mockIdea = {
  id: 1,
  title: "DeFi Garden Protocol",
  description: `A revolutionary yield farming protocol that transforms the traditional DeFi experience into a beautiful, intuitive garden metaphor. Users can "plant" their tokens as seeds, nurture them with liquidity provision, and watch their investments grow and bloom into substantial rewards.`,
  fullDescription: `## 🌱 Vision

The DeFi Garden Protocol reimagines yield farming through the lens of natural growth and cultivation. Instead of complex financial jargon, users interact with familiar gardening concepts that make DeFi accessible to everyone.

## 🔧 Core Features

### Smart Garden Plots
- **Seed Planting**: Deposit tokens to start growing your yield
- **Companion Planting**: Combine different tokens for bonus rewards
- **Seasonal Cycles**: Time-based reward multipliers that mirror natural seasons
- **Garden Tools**: Advanced strategies for experienced farmers

### Visual Growth Tracking
- Real-time 3D garden visualization of your investments
- Growth animations that reflect actual yield accumulation
- Weather system that affects reward rates
- Harvest celebrations with NFT rewards

### Community Greenhouse
- Shared community pools with collective rewards
- Garden competitions and leaderboards
- Knowledge sharing through "Gardening Tips"
- Mentorship program for new gardeners

## 🛠 Technical Architecture

### Smart Contracts
- **GardenCore.sol**: Main protocol logic and yield calculations
- **SeedVault.sol**: Secure token storage and management
- **SeasonManager.sol**: Time-based reward modifiers
- **CommunityGarden.sol**: Shared pool management

### Frontend
- React + Three.js for 3D garden visualization
- Real-time WebSocket connections for live updates
- Progressive Web App for mobile gardening
- Integrated wallet management with WalletConnect

### Backend Services
- Node.js API for user data and analytics
- IPFS for decentralized metadata storage
- The Graph for blockchain data indexing
- Push notifications for harvest reminders

## 📊 Tokenomics

### SEED Token
- **Total Supply**: 100,000,000 SEED
- **Distribution**: 40% farming rewards, 30% community treasury, 20% team, 10% initial liquidity
- **Utility**: Governance voting, premium features, bonus multipliers

### Reward Mechanisms
- Base APY: 8-15% depending on pool
- Seasonal bonuses: Up to 50% additional rewards
- Loyalty multipliers: Long-term stakers get higher yields
- Community rewards: Active participants earn bonus SEED

## 🎯 Roadmap

### Phase 1: Seed (Q1 2024)
- Core protocol deployment on Ethereum
- Basic garden interface with 5 initial crops
- Community governance launch
- Security audits and bug bounty program

### Phase 2: Sprout (Q2 2024)
- Multi-chain expansion (Polygon, Arbitrum)
- Advanced garden tools and strategies
- NFT integration for special achievements
- Mobile app beta release

### Phase 3: Bloom (Q3 2024)
- Cross-chain yield optimization
- AI-powered garden recommendations
- Institutional farming products
- Global hackathon and grants program

### Phase 4: Harvest (Q4 2024)
- Full ecosystem maturity
- Integration with major DeFi protocols
- Educational platform launch
- Sustainability initiatives

## 🔒 Security & Audits

- Multiple security audits by leading firms
- Formal verification of critical functions
- Bug bounty program with $500K+ rewards
- Gradual rollout with increasing TVL limits
- Emergency pause mechanisms and timelock governance

## 🌍 Impact & Sustainability

The DeFi Garden Protocol isn't just about yields—it's about growing a sustainable financial ecosystem. A portion of protocol fees funds real-world environmental projects, creating a bridge between digital and natural gardens.

## 🤝 Team & Advisors

Our team combines deep DeFi expertise with user experience design, backed by advisors from leading protocols and traditional finance. We're committed to building not just a product, but a movement toward more accessible and sustainable DeFi.`,
  author: "0x1234...5678",
  authorName: "GreenThumb",
  authorEns: "builder.eth",
  authorReputation: "Grove-Keeper",
  tags: ["DeFi", "Yield Farming", "Protocol", "Governance"],
  votes: 42,
  interested: 8,
  status: "approved",
  createdAt: "2 days ago",
  techStack: ["Solidity", "React", "Node.js", "IPFS", "The Graph", "Three.js"],
  chains: ["Ethereum", "Polygon", "Arbitrum"],
  funding: {
    target: 50000,
    raised: 32000,
    backers: 156,
  },
  milestones: [
    { name: "Smart Contract Development", status: "completed", date: "Dec 2023" },
    { name: "Frontend MVP", status: "completed", date: "Jan 2024" },
    { name: "Security Audit", status: "in-progress", date: "Feb 2024" },
    { name: "Mainnet Launch", status: "pending", date: "Mar 2024" },
  ],
  mockups: ["/placeholder.svg?height=300&width=500"],
  githubRepo: "https://github.com/example/defi-garden",
  demoUrl: "https://demo.defigarden.xyz",
  inDevelopment: true,
  hotScore: 89,
  developmentProgress: 65,
}

const mockComments = [
  {
    id: 1,
    author: "0x9999...1111",
    authorName: "CryptoFarmer",
    content:
      "This is such a beautiful concept! The garden metaphor makes DeFi so much more approachable. Have you considered adding seasonal events?",
    createdAt: "1 day ago",
    votes: 5,
  },
  {
    id: 2,
    author: "0x8888...2222",
    authorName: "YieldHunter",
    content:
      "Love the composable strategies idea. This could really help newcomers understand complex yield farming concepts.",
    createdAt: "18 hours ago",
    votes: 3,
  },
]

export default function IdeaDetailPage() {
  const [hasVoted, setHasVoted] = useState(false)
  const [isInterested, setIsInterested] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-emerald-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-emerald-700 hover:bg-emerald-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Garden
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-emerald-800">Bloom Ideas</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Idea Header */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-emerald-900 mb-3">{mockIdea.title}</h1>
                    <button
                      onClick={() => setSelectedProfile(mockIdea.author)}
                      className="flex items-center gap-3 text-sm text-emerald-600/70 mb-4 hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">GT</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{mockIdea.authorName}</span>
                      <span>({mockIdea.author})</span>
                      <span>•</span>
                      <span>{mockIdea.createdAt}</span>
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {mockIdea.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Development Status */}
            {mockIdea.inDevelopment && (
              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-green-800">🌱 Currently Growing</span>
                    <Link href={mockIdea.githubRepo} className="ml-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        View Repository
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-emerald-900">About This Idea</h2>
              </CardHeader>
              <CardContent>
                <div className="prose prose-emerald max-w-none">
                  {mockIdea.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="text-emerald-800/90 mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Features */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-emerald-900">🚀 Project Details</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-emerald-800">Community Funding</span>
                    <span className="text-sm text-emerald-600">
                      ${mockIdea.funding.raised.toLocaleString()} / ${mockIdea.funding.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(mockIdea.funding.raised / mockIdea.funding.target) * 100} className="h-3 mb-2" />
                  <div className="flex justify-between text-sm text-emerald-600/70">
                    <span>{mockIdea.funding.backers} backers</span>
                    <span>{Math.round((mockIdea.funding.raised / mockIdea.funding.target) * 100)}% funded</span>
                  </div>
                </div>

                {/* Supported Chains */}
                <div>
                  <h3 className="font-medium text-emerald-800 mb-3">Supported Chains</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockIdea.chains.map((chain) => (
                      <Badge key={chain} variant="outline" className="border-blue-200 text-blue-700">
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="font-medium text-emerald-800 mb-3">Development Milestones</h3>
                  <div className="space-y-3">
                    {mockIdea.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : milestone.status === "in-progress"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1">
                          <span className="text-emerald-900 font-medium">{milestone.name}</span>
                          <span className="text-sm text-emerald-600/70 ml-2">({milestone.date})</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            milestone.status === "completed"
                              ? "border-green-200 text-green-700"
                              : milestone.status === "in-progress"
                                ? "border-yellow-200 text-yellow-700"
                                : "border-gray-200 text-gray-700"
                          }
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Repository
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Full Description */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-emerald-900">📖 Detailed Overview</h2>
              </CardHeader>
              <CardContent>
                <div className="prose prose-emerald max-w-none">
                  <div className="whitespace-pre-wrap text-emerald-800/90">{mockIdea.fullDescription}</div>
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-emerald-900">Tech Stack</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockIdea.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-emerald-200 text-emerald-700">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-emerald-900">Community Feedback</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts on this blooming idea..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                  />
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Add Feedback
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-emerald-200 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                            {comment.authorName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-emerald-800">{comment.authorName}</span>
                        <span className="text-sm text-emerald-600/70">•</span>
                        <span className="text-sm text-emerald-600/70">{comment.createdAt}</span>
                      </div>
                      <p className="text-emerald-800/90 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 h-6 px-2">
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.votes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-semibold text-emerald-900">Take Action</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className={`w-full ${hasVoted ? "bg-rose-500 hover:bg-rose-600" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"} text-white`}
                  onClick={() => setHasVoted(!hasVoted)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${hasVoted ? "fill-current" : ""}`} />
                  {hasVoted ? "Loved!" : "Love This Idea"}
                </Button>

                <Button
                  variant="outline"
                  className={`w-full ${isInterested ? "border-green-500 text-green-700 bg-green-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                  onClick={() => setIsInterested(!isInterested)}
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  {isInterested ? "Growing This!" : "I Want to Build This"}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Stats */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-semibold text-emerald-900">🌟 Garden Metrics</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Community Love</span>
                  </div>
                  <span className="font-semibold text-emerald-900">{mockIdea.votes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Builders Interested</span>
                  </div>
                  <span className="font-semibold text-emerald-900">{mockIdea.interested}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span>Garden Discussions</span>
                  </div>
                  <span className="font-semibold text-emerald-900">{mockComments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Hot Score</span>
                  </div>
                  <span className="font-semibold text-emerald-900">{mockIdea.hotScore}</span>
                </div>
                <div className="pt-3 border-t border-emerald-100">
                  <div className="flex justify-between text-sm text-emerald-600/70 mb-2">
                    <span>Growth Progress</span>
                    <span>{mockIdea.developmentProgress}%</span>
                  </div>
                  <Progress value={mockIdea.developmentProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Similar Ideas */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-semibold text-emerald-900">Related Blooms</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/idea/2"
                  className="block p-3 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                >
                  <h4 className="font-medium text-emerald-900 mb-1">ZK Bloom Verification</h4>
                  <p className="text-sm text-emerald-700/80">Privacy-focused credential system</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600">
                    <Heart className="w-3 h-3" />
                    <span>38</span>
                    <Users className="w-3 h-3 ml-2" />
                    <span>12</span>
                  </div>
                </Link>
                <Link
                  href="/idea/3"
                  className="block p-3 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                >
                  <h4 className="font-medium text-emerald-900 mb-1">NFT Seed Exchange</h4>
                  <p className="text-sm text-emerald-700/80">Growing NFT marketplace</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600">
                    <Heart className="w-3 h-3" />
                    <span>29</span>
                    <Users className="w-3 h-3 ml-2" />
                    <span>6</span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        {selectedProfile && <ProfilePopup address={selectedProfile} onClose={() => setSelectedProfile(null)} />}
      </main>
    </div>
  )
}
