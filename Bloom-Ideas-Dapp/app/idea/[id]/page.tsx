"use client"

import { useState, useEffect } from "react"
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
import UniversalWalletConnection from "@/components/universal-wallet-connection"
import { useIsMobile } from "@/hooks/use-mobile"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { getSproutTypeId } from "@/lib/sprouts"
import { useGardenTheme } from '@/components/garden-theme-context';
import { useParams } from "next/navigation"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const params = useParams();
  const projectId = params?.id ? Number(params.id) : null;
  const [hasVoted, setHasVoted] = useState(false)
  const [isInterested, setIsInterested] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [comments, setComments] = useState<any[]>([])
  const [submittingComment, setSubmittingComment] = useState(false)
  const isMobile = useIsMobile()
  const { gardenTheme } = useGardenTheme();
  const [project, setProject] = useState<any>(null);
  const [projectLinks, setProjectLinks] = useState<any[]>([]);
  const [projectVisuals, setProjectVisuals] = useState<any[]>([]);

  const getThemeHeaderGradient = () => {
    switch (gardenTheme) {
      case 'spring':
        return 'bg-white/80';
      case 'summer':
        return 'bg-gradient-to-r from-yellow-50/80 to-orange-100/80';
      case 'autumn':
        return 'bg-gradient-to-r from-orange-50/80 to-red-100/80';
      case 'winter':
        return 'bg-gradient-to-r from-blue-50/80 to-purple-100/80';
      default:
        return 'bg-white/80';
    }
  };

  // Load comments for this idea
  useEffect(() => {
    if (!projectId) return;
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
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
      
      if (error) {
        console.error("Error loading comments:", error)
        return
      }
      
      setComments(data || [])
    }
    
    loadComments()
  }, [projectId])

  useEffect(() => {
    if (!projectId) return;
    const fetchProjectData = async () => {
      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (projectError) {
        console.error("Error loading project:", projectError);
        return;
      }
      setProject(projectData);
      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from("project_links")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (linksError) {
        console.error("Error loading project links:", linksError);
      } else {
        setProjectLinks(linksData || []);
      }
      // Fetch visuals
      const { data: visualsData, error: visualsError } = await supabase
        .from("project_visuals")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (visualsError) {
        console.error("Error loading project visuals:", visualsError);
      } else {
        setProjectVisuals(visualsData || []);
      }
    };
    fetchProjectData();
  }, [projectId]);

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!walletAddress) {
      toast.error("Connect your wallet first")
      return
    }
    
    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    setSubmittingComment(true)
    try {
      // Insert comment
      const { data: comment, error: commentErr } = await supabase
        .from("comments")
        .insert({
          project_id: projectId,
          user_address: walletAddress,
          content: newComment.trim(),
        })
        .select("id")
        .single()
      
      if (commentErr) throw commentErr

      // Award sprouts for commenting
      const commentTypeId = await getSproutTypeId('comment')
      const { error: sproutsErr } = await supabase
        .from("sprouts")
        .insert({
          user_address: walletAddress,
          sprout_type_id: commentTypeId,
          amount: 2, // 2 sprouts per comment
          related_id: comment.id,
        })
      
      if (!sproutsErr) {
        toast.success("+2 sprouts for your thoughtful comment! 🌱")
      } else {
        console.error("Failed to award comment sprouts:", sproutsErr)
      }

      // Refresh comments
      const { data: newComments, error: refreshErr } = await supabase
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
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
      
      if (!refreshErr) {
        setComments(newComments || [])
      }

      setNewComment("")
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast.error("Failed to submit comment")
    } finally {
      setSubmittingComment(false)
    }
  }

  const ideaData = project || mockIdea;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className={`border-b border-emerald-200/50 ${getThemeHeaderGradient()} backdrop-blur-sm sticky top-0 z-50`}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/">
                <Button variant="ghost" size={isMobile ? "sm" : "sm"} className="text-emerald-700 hover:bg-emerald-50">
                  <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {isMobile ? "Back" : "Back to Garden"}
                </Button>
              </Link>
              <div className="flex items-center gap-2 md:gap-3">
                <img src="/Logo-bloomideas.png" alt="Bloom Ideas Logo" className="w-6 h-6 md:w-8 md:h-8 rounded-full shadow" />
                <span className="font-semibold text-emerald-800 text-sm md:text-base">Bloom Ideas</span>
              </div>
            </div>
            <UniversalWalletConnection onConnectionChange={(connected, address) => {
              if (connected && address) setWalletAddress(address)
              else setWalletAddress("")
            }} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Idea Header */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
              <CardHeader className="pb-3 md:pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-900 mb-2 md:mb-3">{ideaData.title}</h1>
                    <button
                      onClick={() => setSelectedProfile(ideaData.author)}
                      className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-emerald-600/70 mb-3 md:mb-4 hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                    >
                      <Avatar className="w-5 h-5 md:w-6 md:h-6">
                        <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">GT</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{ideaData.authorName}</span>
                      <span className="hidden sm:inline">({ideaData.author})</span>
                      <span>•</span>
                      <span>{ideaData.createdAt}</span>
                    </button>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {ideaData.tags.map((tag: any) => (
                        <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Development Status */}
            {ideaData.inDevelopment && (
              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-green-800 text-sm md:text-base">🌱 Currently Growing</span>
                    <Link href={ideaData.githubRepo} className="ml-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent text-xs"
                      >
                        <Github className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        {isMobile ? "Repo" : "View Repository"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h2 className="text-lg md:text-xl font-semibold text-emerald-900">About This Idea</h2>
              </CardHeader>
              <CardContent>
                {/* Visuals Grid */}
                {projectVisuals.length > 0 && (
                  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projectVisuals.map((visual: any) => (
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
                {/* Markdown Description */}
                <div className="prose prose-emerald max-w-none mb-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{ideaData.description}</ReactMarkdown>
                </div>
                {/* Project Links */}
                {projectLinks.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold text-emerald-800 text-sm mb-2">Project Links</h3>
                    <ul className="space-y-2">
                      {projectLinks.map((link: any) => {
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
              </CardContent>
            </Card>

            {/* Enhanced Features */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h2 className="text-lg md:text-xl font-semibold text-emerald-900">🚀 Project Details</h2>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-emerald-800 text-sm md:text-base">Community Funding</span>
                    <span className="text-xs md:text-sm text-emerald-600">
                      ${ideaData.funding.raised.toLocaleString()} / ${ideaData.funding.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(ideaData.funding.raised / ideaData.funding.target) * 100} className="h-2 md:h-3 mb-2" />
                  <div className="flex justify-between text-xs md:text-sm text-emerald-600/70">
                    <span>{ideaData.funding.backers} backers</span>
                    <span>{Math.round((ideaData.funding.raised / ideaData.funding.target) * 100)}% funded</span>
                  </div>
                </div>

                {/* Supported Chains */}
                <div>
                  <h3 className="font-medium text-emerald-800 mb-2 md:mb-3 text-sm md:text-base">Supported Chains</h3>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {ideaData.chains.map((chain: any) => (
                      <Badge key={chain} variant="outline" className="border-blue-200 text-blue-700 text-xs">
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="font-medium text-emerald-800 mb-2 md:mb-3 text-sm md:text-base">Development Milestones</h3>
                  <div className="space-y-2 md:space-y-3">
                    {ideaData.milestones.map((milestone: any, index: any) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3">
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : milestone.status === "in-progress"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-emerald-900 font-medium text-sm md:text-base">{milestone.name}</span>
                          <span className="text-xs md:text-sm text-emerald-600/70 ml-1 md:ml-2">({milestone.date})</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            milestone.status === "completed"
                              ? "border-green-200 text-green-700"
                              : milestone.status === "in-progress"
                                ? "border-yellow-200 text-yellow-700"
                                : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent text-xs md:text-sm"
                  >
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    {isMobile ? "Demo" : "Live Demo"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent text-xs md:text-sm"
                  >
                    <Github className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    {isMobile ? "Repo" : "Repository"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Full Description */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h2 className="text-lg md:text-xl font-semibold text-emerald-900">📖 Detailed Overview</h2>
              </CardHeader>
              <CardContent>
                {/* Visuals Grid */}
                {projectVisuals.length > 0 && (
                  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projectVisuals.map((visual: any) => (
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
                {/* Markdown Full Description */}
                <div className="prose prose-emerald max-w-none mb-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{ideaData.fullDescription}</ReactMarkdown>
                </div>
                {/* Project Links */}
                {projectLinks.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold text-emerald-800 text-sm mb-2">Project Links</h3>
                    <ul className="space-y-2">
                      {projectLinks.map((link: any) => {
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
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h2 className="text-lg md:text-xl font-semibold text-emerald-900">Tech Stack</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {ideaData.techStack.map((tech: any) => (
                    <Badge key={tech} variant="outline" className="border-emerald-200 text-emerald-700 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h2 className="text-lg md:text-xl font-semibold text-emerald-900">Community Feedback</h2>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* Add Comment */}
                <div className="space-y-2 md:space-y-3">
                  <Textarea
                    placeholder="Share your thoughts on this blooming idea..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 text-sm md:text-base"
                  />
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={submittingComment}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm md:text-base"
                  >
                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    {submittingComment ? "Posting..." : "Add Feedback"}
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3 md:space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-6 text-emerald-600/70">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                      <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    comments.map((comment) => {
                      const authorName = comment.users?.bloom_username || 
                        `${comment.user_address.slice(0, 6)}...${comment.user_address.slice(-4)}`
                      const initials = authorName.slice(0, 2).toUpperCase()
                      const timeAgo = new Date(comment.created_at).toLocaleDateString()
                      
                      return (
                        <div key={comment.id} className="border-l-2 border-emerald-200 pl-3 md:pl-4 py-2">
                          <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                            <Avatar className="w-4 h-4 md:w-5 md:h-5">
                              <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-emerald-800 text-sm md:text-base">{authorName}</span>
                            <span className="text-xs md:text-sm text-emerald-600/70">•</span>
                            <span className="text-xs md:text-sm text-emerald-600/70">{timeAgo}</span>
                          </div>
                          <p className="text-emerald-800/90 mb-1 md:mb-2 text-sm md:text-base">{comment.content}</p>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Actions */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h3 className="font-semibold text-emerald-900 text-sm md:text-base">Take Action</h3>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <Button
                  className={`w-full text-sm md:text-base ${hasVoted ? "bg-rose-500 hover:bg-rose-600" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"} text-white`}
                  onClick={() => setHasVoted(!hasVoted)}
                >
                  <Heart className={`w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 ${hasVoted ? "fill-current" : ""}`} />
                  {hasVoted ? "Loved!" : "Love This Idea"}
                </Button>

                <Button
                  variant="outline"
                  className={`w-full text-sm md:text-base ${isInterested ? "border-green-500 text-green-700 bg-green-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                  onClick={() => setIsInterested(!isInterested)}
                >
                  <Leaf className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {isInterested ? "Growing This!" : "I Want to Build This"}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Stats */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h3 className="font-semibold text-emerald-900 text-sm md:text-base">🌟 Garden Metrics</h3>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 md:gap-2 text-emerald-700">
                    <Heart className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
                    <span className="text-xs md:text-sm">Community Love</span>
                  </div>
                  <span className="font-semibold text-emerald-900 text-sm md:text-base">{ideaData.votes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 md:gap-2 text-emerald-700">
                    <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                    <span className="text-xs md:text-sm">Builders Interested</span>
                  </div>
                  <span className="font-semibold text-emerald-900 text-sm md:text-base">{ideaData.interested}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 md:gap-2 text-emerald-700">
                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                    <span className="text-xs md:text-sm">Garden Discussions</span>
                  </div>
                  <span className="font-semibold text-emerald-900 text-sm md:text-base">{mockComments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 md:gap-2 text-emerald-700">
                    <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                    <span className="text-xs md:text-sm">Hot Score</span>
                  </div>
                  <span className="font-semibold text-emerald-900 text-sm md:text-base">{ideaData.hotScore}</span>
                </div>
                <div className="pt-2 md:pt-3 border-t border-emerald-100">
                  <div className="flex justify-between text-xs md:text-sm text-emerald-600/70 mb-1 md:mb-2">
                    <span>Growth Progress</span>
                    <span>{ideaData.developmentProgress}%</span>
                  </div>
                  <Progress value={ideaData.developmentProgress} className="h-1.5 md:h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Similar Ideas */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-4">
                <h3 className="font-semibold text-emerald-900 text-sm md:text-base">Related Blooms</h3>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <Link
                  href="/idea/2"
                  className="block p-2 md:p-3 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                >
                  <h4 className="font-medium text-emerald-900 mb-1 text-sm md:text-base">ZK Bloom Verification</h4>
                  <p className="text-xs md:text-sm text-emerald-700/80">Privacy-focused credential system</p>
                  <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 text-xs text-emerald-600">
                    <Heart className="w-2 h-2 md:w-3 md:h-3" />
                    <span>38</span>
                    <Users className="w-2 h-2 md:w-3 md:h-3 ml-1 md:ml-2" />
                    <span>12</span>
                  </div>
                </Link>
                <Link
                  href="/idea/3"
                  className="block p-2 md:p-3 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                >
                  <h4 className="font-medium text-emerald-900 mb-1 text-sm md:text-base">NFT Seed Exchange</h4>
                  <p className="text-xs md:text-sm text-emerald-700/80">Growing NFT marketplace</p>
                  <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 text-xs text-emerald-600">
                    <Heart className="w-2 h-2 md:w-3 md:h-3" />
                    <span>29</span>
                    <Users className="w-2 h-2 md:w-3 md:h-3 ml-1 md:ml-2" />
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
