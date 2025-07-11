"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { X, Heart, Users, Github, ExternalLink, Zap, Leaf, Sparkles, Star, Calendar } from "lucide-react"
import Link from "next/link"

interface IdeaDetailModalProps {
  idea: any
  onClose: () => void
}

export default function IdeaDetailModal({ idea, onClose }: IdeaDetailModalProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [isInterested, setIsInterested] = useState(false)

  const mockDetailedIdea = {
    ...idea,
    fullDescription: `## 🌱 Project Vision

${idea.description}

## 🔧 Key Features

### Smart Garden Mechanics
- **Seed Planting**: Users can deposit tokens to start their yield farming journey
- **Growth Tracking**: Real-time visualization of investment growth
- **Harvest Rewards**: Automated reward distribution with bonus multipliers
- **Community Pools**: Shared farming opportunities with collective benefits

### Technical Innovation
- **Gas Optimization**: Advanced smart contract architecture for minimal fees
- **Cross-Chain Support**: Seamless integration across multiple blockchains
- **Security First**: Multi-signature wallets and time-locked governance
- **User Experience**: Intuitive interface designed for both beginners and experts

## 🛠 Technical Stack

### Smart Contracts
- Solidity 0.8.19 with OpenZeppelin libraries
- Upgradeable proxy pattern for future enhancements
- Comprehensive test coverage with Hardhat
- Formal verification for critical functions

### Frontend
- React 18 with TypeScript for type safety
- Next.js 14 for optimal performance
- Tailwind CSS for responsive design
- Web3 integration with wagmi and viem

### Backend Infrastructure
- Node.js with Express for API services
- PostgreSQL for relational data storage
- Redis for caching and session management
- IPFS for decentralized file storage

## 📊 Tokenomics & Funding

### Token Distribution
- **Community Rewards**: 40% allocated to user incentives
- **Development Fund**: 25% for ongoing development
- **Team & Advisors**: 20% with 2-year vesting
- **Initial Liquidity**: 15% for DEX liquidity

### Funding Progress
- **Target**: $50,000 for MVP development
- **Current**: $32,000 raised from community
- **Backers**: 156 supporters and counting
- **Timeline**: 3 months to full deployment`,
    techStack: ["Solidity", "React", "Node.js", "IPFS", "PostgreSQL", "Redis"],
    chains: ["Ethereum", "Polygon", "Arbitrum"],
    funding: {
      target: 50000,
      raised: 32000,
      backers: 156,
    },
    milestones: [
      { name: "Smart Contract Development", status: "completed", date: "Dec 2023", progress: 100 },
      { name: "Frontend MVP", status: "completed", date: "Jan 2024", progress: 100 },
      { name: "Security Audit", status: "in-progress", date: "Feb 2024", progress: 65 },
      { name: "Mainnet Launch", status: "pending", date: "Mar 2024", progress: 0 },
    ],
    team: [
      { name: "Alice Green", role: "Lead Developer", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Bob Forest", role: "Smart Contract Engineer", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Carol Bloom", role: "UI/UX Designer", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    demoUrl: "https://demo.defigarden.xyz",
    githubRepo: "https://github.com/example/defi-garden",
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto border-emerald-100 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
        <CardHeader className="relative">
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
                <div className="flex items-center gap-3 text-sm text-emerald-600/70 mb-4">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                      {idea.author.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">builder.eth</span>
                  <span>({idea.author})</span>
                  <Badge className="bg-teal-400 text-white border-0">Grove-Keeper</Badge>
                  <span>•</span>
                  <span>{idea.createdAt}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.votes}</p>
                <p className="text-xs text-emerald-600/70">Loves</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">{idea.interested}</p>
                <p className="text-xs text-emerald-600/70">Builders</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">89</p>
                <p className="text-xs text-emerald-600/70">Hot Score</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Star className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-900">4.8</p>
                <p className="text-xs text-emerald-600/70">Rating</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              className={`${hasVoted ? "bg-rose-500 hover:bg-rose-600" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"} text-white`}
              onClick={() => setHasVoted(!hasVoted)}
            >
              <Heart className={`w-4 h-4 mr-2 ${hasVoted ? "fill-current" : ""}`} />
              {hasVoted ? "Loved!" : "Love This"}
            </Button>
            <Button
              variant="outline"
              className={`${isInterested ? "border-green-500 text-green-700 bg-green-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
              onClick={() => setIsInterested(!isInterested)}
            >
              <Leaf className="w-4 h-4 mr-2" />
              {isInterested ? "Growing This!" : "I Want to Build"}
            </Button>
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
            <Link href={`/idea/${idea.id}`} className="ml-auto">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Full Details
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-3">🌱 Project Overview</h3>
                <div className="prose prose-emerald max-w-none">
                  <div className="whitespace-pre-wrap text-emerald-800/90 text-sm">
                    {mockDetailedIdea.fullDescription}
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-3">🛠 Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {mockDetailedIdea.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-emerald-200 text-emerald-700">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Supported Chains */}
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-3">⛓️ Supported Chains</h3>
                <div className="flex flex-wrap gap-2">
                  {mockDetailedIdea.chains.map((chain) => (
                    <Badge key={chain} variant="outline" className="border-blue-200 text-blue-700">
                      {chain}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Funding Progress */}
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-3">💰 Community Funding</h3>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-emerald-800">Progress</span>
                    <span className="text-sm text-emerald-600">
                      ${mockDetailedIdea.funding.raised.toLocaleString()} / $
                      {mockDetailedIdea.funding.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(mockDetailedIdea.funding.raised / mockDetailedIdea.funding.target) * 100}
                    className="h-3 mb-2"
                  />
                  <div className="flex justify-between text-sm text-emerald-600/70">
                    <span>{mockDetailedIdea.funding.backers} backers</span>
                    <span>
                      {Math.round((mockDetailedIdea.funding.raised / mockDetailedIdea.funding.target) * 100)}% funded
                    </span>
                  </div>
                </div>
              </div>

              {/* Development Milestones */}
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-3">🎯 Development Milestones</h3>
                <div className="space-y-3">
                  {mockDetailedIdea.milestones.map((milestone, index) => (
                    <div key={index} className="bg-emerald-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-emerald-900 text-sm">{milestone.name}</span>
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
                          {milestone.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-emerald-600/70 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{milestone.date}</span>
                      </div>
                      <Progress value={milestone.progress} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-3">👥 Team</h3>
                <div className="space-y-2">
                  {mockDetailedIdea.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-emerald-900 text-sm">{member.name}</p>
                        <p className="text-xs text-emerald-600/70">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
