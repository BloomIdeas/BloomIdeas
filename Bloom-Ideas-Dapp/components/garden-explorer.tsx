"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Flower2, Leaf, Heart, User, Bell, Sparkles, TreePine, Sun, Droplets } from "lucide-react"
import Link from "next/link"

interface GardenExplorerProps {
  walletAddress: string
}

export default function GardenExplorer({ walletAddress }: GardenExplorerProps) {
  const [showGardenDropdown, setShowGardenDropdown] = useState(false)
  const [gardenTheme, setGardenTheme] = useState("spring") // spring, summer, autumn, winter

  const gardenStats = {
    sprouts: 342,
    gardensLoved: 28,
    ideasPlanted: 12,
    reputation: "Grove-Keeper",
    level: 4,
    dailyStreak: 15,
  }

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "spring":
        return "from-emerald-500 to-teal-500"
      case "summer":
        return "from-yellow-500 to-orange-500"
      case "autumn":
        return "from-orange-500 to-red-500"
      case "winter":
        return "from-blue-500 to-purple-500"
      default:
        return "from-emerald-500 to-teal-500"
    }
  }

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "spring":
        return <Flower2 className="w-4 h-4" />
      case "summer":
        return <Sun className="w-4 h-4" />
      case "autumn":
        return <TreePine className="w-4 h-4" />
      case "winter":
        return <Droplets className="w-4 h-4" />
      default:
        return <Flower2 className="w-4 h-4" />
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Quick Garden Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm p-2 relative"
        >
          <Bell className="w-4 h-4" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </Button>

        <Link href="/profile/me">
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm p-2"
          >
            <User className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Garden Explorer */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowGardenDropdown(!showGardenDropdown)}
          className={`border-emerald-200 text-white hover:opacity-90 bg-gradient-to-r ${getThemeColors(gardenTheme)} backdrop-blur-sm`}
        >
          {getThemeIcon(gardenTheme)}
          <span className="font-medium ml-2">Explore Garden</span>
          <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
        </Button>

        {showGardenDropdown && (
          <Card className="absolute top-full right-0 mt-2 w-80 border-emerald-100 bg-white/95 backdrop-blur-sm shadow-lg z-50">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Garden Profile Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
                  <Avatar className="w-12 h-12 ring-2 ring-emerald-200">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {walletAddress.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-900">Garden Builder</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-teal-400 text-white border-0">
                        <Flower2 className="w-3 h-3 mr-1" />
                        {gardenStats.reputation}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-600">Level {gardenStats.level}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Garden Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
                    <Leaf className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-900">{gardenStats.sprouts}</p>
                    <p className="text-xs text-emerald-600/70">Sprouts Earned</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg">
                    <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-900">{gardenStats.gardensLoved}</p>
                    <p className="text-xs text-emerald-600/70">Gardens Loved</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-900">{gardenStats.ideasPlanted}</p>
                    <p className="text-xs text-emerald-600/70">Ideas Planted</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                    <Sun className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-900">{gardenStats.dailyStreak}</p>
                    <p className="text-xs text-emerald-600/70">Day Streak</p>
                  </div>
                </div>

                {/* Garden Theme Selector */}
                <div className="pt-3 border-t border-emerald-100">
                  <p className="text-sm font-medium text-emerald-800 mb-2">🌸 Garden Season</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "spring", label: "Spring", icon: Flower2, color: "emerald" },
                      { id: "summer", label: "Summer", icon: Sun, color: "yellow" },
                      { id: "autumn", label: "Autumn", icon: TreePine, color: "orange" },
                      { id: "winter", label: "Winter", icon: Droplets, color: "blue" },
                    ].map((theme) => (
                      <Button
                        key={theme.id}
                        variant={gardenTheme === theme.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGardenTheme(theme.id)}
                        className={`p-2 ${
                          gardenTheme === theme.id
                            ? `bg-${theme.color}-500 text-white`
                            : `border-${theme.color}-200 text-${theme.color}-700 hover:bg-${theme.color}-50`
                        }`}
                      >
                        <theme.icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Garden Weather */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">🌤️ Garden Weather</p>
                      <p className="text-xs text-emerald-600/70">Perfect for planting new ideas!</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-900">Sunny</p>
                      <p className="text-xs text-emerald-600/70">+20% Bloom Bonus</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
