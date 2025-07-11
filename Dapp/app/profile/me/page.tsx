"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Flower2,
  Github,
  Twitter,
  MessageCircle,
  ExternalLink,
  Crown,
  Zap,
  Trophy,
  Heart,
  Code,
  Star,
  Bell,
  Edit,
  Save,
} from "lucide-react"
import Link from "next/link"

const mockProfile = {
  address: "0x1234...5678",
  ensName: "builder.eth",
  avatar: "/placeholder.svg?height=120&width=120",
  displayName: "Garden Builder",
  bio: "Passionate Web3 developer cultivating the future of DeFi. Love building beautiful, functional protocols that make crypto accessible to everyone. 🌱",
  reputation: "Grove-Keeper",
  reputationLevel: 4,
  joinDate: "March 2023",
  location: "San Francisco, CA",
  website: "https://gardenbuilder.dev",
  social: {
    github: "gardenbuilder",
    twitter: "gardenbuilder_",
    discord: "gardenbuilder#1234",
  },
  stats: {
    ideasSubmitted: 12,
    ideasBuilt: 8,
    votesGiven: 156,
    commentsPosted: 89,
    sprouts: 342,
    currentStreak: 15,
    longestStreak: 28,
  },
  nfts: [
    {
      id: 1,
      name: "Seed Planter",
      image: "/placeholder.svg?height=100&width=100",
      rarity: "Common",
      description: "First idea planted in the garden",
      earned: "Dec 2023",
    },
    {
      id: 2,
      name: "First Bloom",
      image: "/placeholder.svg?height=100&width=100",
      rarity: "Rare",
      description: "First idea successfully built",
      earned: "Jan 2024",
    },
    {
      id: 3,
      name: "Grove Keeper",
      image: "/placeholder.svg?height=100&width=100",
      rarity: "Epic",
      description: "Reached Grove-Keeper reputation",
      earned: "Feb 2024",
    },
    {
      id: 4,
      name: "Innovation Catalyst",
      image: "/placeholder.svg?height=100&width=100",
      rarity: "Legendary",
      description: "Inspired 10+ builders to join projects",
      earned: "Mar 2024",
    },
  ],
}

const reputationLevels = [
  { name: "Seed", level: 1, color: "bg-yellow-400", sproutsNeeded: 0 },
  { name: "Sprout", level: 2, color: "bg-green-400", sproutsNeeded: 50 },
  { name: "Bloom", level: 3, color: "bg-emerald-400", sproutsNeeded: 150 },
  { name: "Grove-Keeper", level: 4, color: "bg-teal-400", sproutsNeeded: 300 },
  { name: "Garden Master", level: 5, color: "bg-purple-400", sproutsNeeded: 500 },
]

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(mockProfile)

  const currentLevel = reputationLevels.find((level) => level.level === mockProfile.reputationLevel)
  const nextLevel = reputationLevels.find((level) => level.level === mockProfile.reputationLevel + 1)
  const progressToNext = nextLevel
    ? ((mockProfile.stats.sprouts - currentLevel!.sproutsNeeded) /
        (nextLevel.sproutsNeeded - currentLevel!.sproutsNeeded)) *
      100
    : 100

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save the profile data to your backend
  }

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
                <span className="font-semibold text-emerald-800">My Garden Profile</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm mb-8">
          <div className="h-24 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-t-lg"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-12">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.displayName} />
                <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">GB</AvatarFallback>
              </Avatar>

              <div className="flex-1 pt-12 md:pt-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="github">GitHub Username</Label>
                        <Input
                          id="github"
                          value={profileData.social.github}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              social: { ...profileData.social, github: e.target.value },
                            })
                          }
                          className="border-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter Username</Label>
                        <Input
                          id="twitter"
                          value={profileData.social.twitter}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              social: { ...profileData.social, twitter: e.target.value },
                            })
                          }
                          className="border-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                    </div>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-emerald-900 mb-1">{profileData.displayName}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-700 font-medium">{profileData.ensName}</span>
                      <span className="text-emerald-600/70">({profileData.address})</span>
                      <Badge className={`${currentLevel?.color} text-white border-0`}>
                        <Crown className="w-3 h-3 mr-1" />
                        {profileData.reputation}
                      </Badge>
                    </div>
                    <p className="text-emerald-800/80 max-w-2xl mb-4">{profileData.bio}</p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4 mb-4">
                      <a
                        href={`https://github.com/${profileData.social.github}`}
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm">@{profileData.social.github}</span>
                      </a>
                      <a
                        href={`https://twitter.com/${profileData.social.twitter}`}
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="text-sm">@{profileData.social.twitter}</span>
                      </a>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{profileData.social.discord}</span>
                      </div>
                    </div>

                    {/* Reputation Progress */}
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-emerald-800">Garden Growth</span>
                        <span className="text-sm text-emerald-600">{profileData.stats.sprouts} Sprouts</span>
                      </div>
                      <Progress value={progressToNext} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-emerald-600/70">
                        <span>{currentLevel?.name}</span>
                        {nextLevel && (
                          <span>
                            {nextLevel.sproutsNeeded - profileData.stats.sprouts} to {nextLevel.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-900">{profileData.stats.ideasSubmitted}</p>
              <p className="text-sm text-emerald-600/70">Ideas Planted</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-900">{profileData.stats.ideasBuilt}</p>
              <p className="text-sm text-emerald-600/70">Ideas Built</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-900">{profileData.stats.votesGiven}</p>
              <p className="text-sm text-emerald-600/70">Votes Cast</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-900">{profileData.stats.currentStreak}</p>
              <p className="text-sm text-emerald-600/70">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/80 border border-emerald-200">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="ideas"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              My Ideas
            </TabsTrigger>
            <TabsTrigger
              value="garden"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              NFT Garden
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Garden Theater */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-xl font-semibold text-emerald-900">🌸 Garden Theater</h3>
                <p className="text-emerald-700/70">Your personal garden visualization</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-8 text-center">
                  <div className="grid grid-cols-8 gap-2 max-w-md mx-auto mb-4">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full ${
                          i < Math.floor(profileData.stats.sprouts / 10)
                            ? "bg-gradient-to-br from-pink-400 to-rose-500 animate-pulse"
                            : "bg-emerald-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-emerald-700 font-medium">
                    {Math.floor(profileData.stats.sprouts / 10)} petals bloomed from your garden activities
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-xl font-semibold text-emerald-900">Recent Garden Activity</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-900 font-medium">Loved "ZK Privacy Garden"</p>
                    <p className="text-sm text-emerald-600/70">2 hours ago • +1 Sprout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-900 font-medium">Commented on "DeFi Yield Optimizer"</p>
                    <p className="text-sm text-emerald-600/70">1 day ago • +2 Sprouts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-900 font-medium">Planted new idea "Cross-Chain Bridge"</p>
                    <p className="text-sm text-emerald-600/70">3 days ago • +5 Sprouts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="garden" className="space-y-6">
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-xl font-semibold text-emerald-900">🎨 Invisible Gardens NFT Collection</h3>
                <p className="text-emerald-700/70">Your earned achievements and milestones</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {profileData.nfts.map((nft) => (
                    <Card key={nft.id} className="border-emerald-100 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                          <Flower2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h4 className="font-semibold text-emerald-900 mb-1">{nft.name}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            nft.rarity === "Legendary"
                              ? "border-purple-300 text-purple-700"
                              : nft.rarity === "Epic"
                                ? "border-orange-300 text-orange-700"
                                : nft.rarity === "Rare"
                                  ? "border-blue-300 text-blue-700"
                                  : "border-gray-300 text-gray-700"
                          }`}
                        >
                          {nft.rarity}
                        </Badge>
                        <p className="text-xs text-emerald-700/80 mt-2 mb-3">{nft.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
