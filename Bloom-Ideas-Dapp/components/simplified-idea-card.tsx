"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Users, MessageCircle, Sparkles, TrendingUp } from "lucide-react"

interface SimplifiedIdeaCardProps {
  idea: any
  onViewDetails: (idea: any) => void
  onProfileClick: (address: string) => void
}

export default function SimplifiedIdeaCard({ idea, onViewDetails, onProfileClick }: SimplifiedIdeaCardProps) {
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
    <Card className="group hover:shadow-xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 bg-white/90 backdrop-blur-sm cursor-pointer">
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-emerald-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-2">
              {idea.title}
            </h3>
            <p className="text-emerald-800/70 text-sm line-clamp-2 mb-3">{idea.description}</p>
          </div>
          <Badge className={`${statusInfo.color} ml-2 flex-shrink-0`}>
            {statusInfo.emoji} {statusInfo.label}
          </Badge>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onProfileClick(idea.author)
            }}
            className="flex items-center gap-2 hover:bg-emerald-50 rounded-lg p-1 transition-colors"
          >
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                {idea.author.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-emerald-800">builder.eth</span>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            <span className="text-xs text-emerald-600">Grove-Keeper</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
              {tag}
            </Badge>
          ))}
          {idea.tags.length > 3 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
              +{idea.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Garden Metrics */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-rose-600">
              <Heart className="w-3 h-3" />
              <span className="font-medium">{idea.votes}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <Users className="w-3 h-3" />
              <span className="font-medium">{idea.interested}</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <MessageCircle className="w-3 h-3" />
              <span className="font-medium">{idea.comments || 5}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-medium">Bloom Score: {idea.bloomScore || 85}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetails(idea)}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          size="sm"
        >
          <Sparkles className="w-3 h-3 mr-2" />
          Explore Garden
        </Button>
      </CardContent>
    </Card>
  )
}
