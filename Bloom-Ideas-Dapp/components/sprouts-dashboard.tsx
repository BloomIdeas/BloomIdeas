// components/sprouts-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  Sparkles,
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Flower2,
  Heart,
  MessageCircle,
  Code,
  Users,
} from "lucide-react"
import { useSprouts } from "@/hooks/use-sprouts"
import { getReputationLevel } from "@/lib/sprouts"
import { supabase } from "@/lib/supabaseClient"

interface SproutsDashboardProps {
  walletAddress: string
  onClose: () => void
}

interface SproutHistory {
  id: number
  type: string
  amount: number
  created_at: string
  related_id?: number
  project_title?: string
}

export default function SproutsDashboard({ walletAddress, onClose }: SproutsDashboardProps) {
  const { totalSprouts, sproutsByType, loading, refreshSprouts } = useSprouts(walletAddress)
  const [sproutHistory, setSproutHistory] = useState<SproutHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const reputationLevel = getReputationLevel(totalSprouts)
  const nextLevel = getReputationLevel(reputationLevel.sproutsNeeded + 1)
  const progressToNext = nextLevel 
    ? ((totalSprouts - reputationLevel.sproutsNeeded) / (nextLevel.sproutsNeeded - reputationLevel.sproutsNeeded)) * 100
    : 100

  // Load sprout history
  useEffect(() => {
    const loadSproutHistory = async () => {
      setHistoryLoading(true)
      try {
        const { data, error } = await supabase
          .from("sprouts")
          .select(`
            id,
            type,
            amount,
            created_at,
            related_id,
            projects!sprouts_related_id_fkey (
              title
            )
          `)
          .eq("user_address", walletAddress)
          .order("created_at", { ascending: false })
          .limit(50)
        
        if (error) throw error
        
                 const history = data?.map(sprout => ({
           id: sprout.id,
           type: sprout.type,
           amount: sprout.amount,
           created_at: sprout.created_at,
           related_id: sprout.related_id,
           project_title: sprout.projects?.[0]?.title
         })) || []
        
        setSproutHistory(history)
      } catch (error) {
        console.error("Error loading sprout history:", error)
      } finally {
        setHistoryLoading(false)
      }
    }
    
    loadSproutHistory()
  }, [walletAddress])

  const getSproutIcon = (type: string) => {
    switch (type) {
      case "planted":
        return <Flower2 className="w-4 h-4 text-green-600" />
      case "nurtured":
        return <Heart className="w-4 h-4 text-rose-500" />
      case "commented":
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case "joined":
        return <Users className="w-4 h-4 text-purple-500" />
      case "built":
        return <Code className="w-4 h-4 text-orange-500" />
      default:
        return <Sparkles className="w-4 h-4 text-yellow-500" />
    }
  }

  const getSproutLabel = (type: string) => {
    switch (type) {
      case "planted":
        return "Planted Idea"
      case "nurtured":
        return "Nurtured Garden"
      case "commented":
        return "Shared Thoughts"
      case "joined":
        return "Joined Project"
      case "built":
        return "Built Something"
      default:
        return "Earned Sprouts"
    }
  }

  const achievements = [
    {
      id: "first_plant",
      name: "First Bloom",
      description: "Plant your first idea",
      icon: <Flower2 className="w-6 h-6" />,
      unlocked: (sproutsByType.planted || 0) >= 50,
      progress: Math.min((sproutsByType.planted || 0) / 50, 1)
    },
    {
      id: "nurturer",
      name: "Garden Nurturer",
      description: "Nurture 10 different ideas",
      icon: <Heart className="w-6 h-6" />,
      unlocked: (sproutsByType.nurtured || 0) >= 10,
      progress: Math.min((sproutsByType.nurtured || 0) / 10, 1)
    },
    {
      id: "commenter",
      name: "Thoughtful Gardener",
      description: "Leave 5 helpful comments",
      icon: <MessageCircle className="w-6 h-6" />,
      unlocked: (sproutsByType.commented || 0) >= 10,
      progress: Math.min((sproutsByType.commented || 0) / 10, 1)
    },
    {
      id: "reputation",
      name: "Grove Keeper",
      description: "Reach Grove-Keeper reputation",
      icon: <Trophy className="w-6 h-6" />,
      unlocked: reputationLevel.name === "Grove-Keeper" || reputationLevel.name === "Garden Master",
      progress: reputationLevel.name === "Garden Master" ? 1 : progressToNext / 100
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden border-emerald-100 bg-white/95 backdrop-blur-sm">
        <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900">Garden Sprouts Dashboard</h2>
                <p className="text-sm text-emerald-600">Track your growth and achievements</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-emerald-600">
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-emerald-50 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Current Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">
                        {loading ? "..." : totalSprouts}
                      </p>
                      <p className="text-sm text-emerald-600">Total Sprouts</p>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-100 bg-gradient-to-br from-rose-50 to-pink-50">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">{reputationLevel.name}</p>
                      <p className="text-sm text-emerald-600">Reputation Level</p>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-100 bg-gradient-to-br from-blue-50 to-cyan-50">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">
                        {nextLevel ? nextLevel.sproutsNeeded - totalSprouts : 0}
                      </p>
                      <p className="text-sm text-emerald-600">To Next Level</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress to Next Level */}
                <Card className="border-emerald-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-emerald-900">Progress to {nextLevel?.name || "Max Level"}</h3>
                      <span className="text-sm text-emerald-600">{Math.round(progressToNext)}%</span>
                    </div>
                    <Progress value={progressToNext} className="h-3 mb-2" />
                    <div className="flex justify-between text-xs text-emerald-600/70">
                      <span>{reputationLevel.name} ({reputationLevel.sproutsNeeded} sprouts)</span>
                      {nextLevel && (
                        <span>{nextLevel.name} ({nextLevel.sproutsNeeded} sprouts)</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Sprouts Breakdown */}
                <Card className="border-emerald-100">
                  <CardHeader>
                    <h3 className="font-semibold text-emerald-900">Sprouts Breakdown</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(sproutsByType).map(([type, amount]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getSproutIcon(type)}
                          <div>
                            <p className="font-medium text-emerald-900">{getSproutLabel(type)}</p>
                            <p className="text-sm text-emerald-600">+{amount} sprouts earned</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                          {amount}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <h3 className="font-semibold text-emerald-900">Recent Sprouts Activity</h3>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="text-emerald-600 mt-2">Loading history...</p>
                      </div>
                    ) : sproutHistory.length === 0 ? (
                      <div className="text-center py-8 text-emerald-600">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                        <p>No sprouts activity yet. Start participating to earn sprouts!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sproutHistory.map((sprout) => (
                          <div key={sprout.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                            {getSproutIcon(sprout.type)}
                            <div className="flex-1">
                              <p className="font-medium text-emerald-900">
                                {getSproutLabel(sprout.type)}
                                {sprout.project_title && (
                                  <span className="text-emerald-600 font-normal"> on "{sprout.project_title}"</span>
                                )}
                              </p>
                              <p className="text-sm text-emerald-600">
                                {new Date(sprout.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="bg-emerald-500 text-white">
                              +{sprout.amount}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-4">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <h3 className="font-semibold text-emerald-900">Garden Achievements</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            achievement.unlocked
                              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                achievement.unlocked
                                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {achievement.icon}
                            </div>
                            <div>
                              <h4 className={`font-semibold ${
                                achievement.unlocked ? "text-emerald-900" : "text-gray-600"
                              }`}>
                                {achievement.name}
                              </h4>
                              <p className={`text-sm ${
                                achievement.unlocked ? "text-emerald-600" : "text-gray-500"
                              }`}>
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                          <Progress value={achievement.progress * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-emerald-600 mt-2">
                            <span>{achievement.unlocked ? "Unlocked!" : "In Progress"}</span>
                            <span>{Math.round(achievement.progress * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </Card>
    </div>
  )
} 