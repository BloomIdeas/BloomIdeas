"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Eye, Users, Flower2, Shield, AlertTriangle } from "lucide-react"
import Image from "next/image"

const pendingIdeas = [
  {
    id: 4,
    title: "Cross-Chain Garden Bridge",
    description:
      "A beautiful bridge protocol that allows users to transfer assets between different blockchains with a garden-themed interface...",
    author: "0x3333...4444",
    tags: ["DeFi", "Cross-Chain", "Bridge"],
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 5,
    title: "DAO Greenhouse Governance",
    description:
      "A governance platform where DAO decisions grow organically through community discussion and voting...",
    author: "0x5555...6666",
    tags: ["DAO", "Governance", "Social"],
    submittedAt: "5 hours ago",
    status: "pending",
  },
]

const builderRequests = [
  {
    id: 1,
    ideaTitle: "DeFi Garden Protocol",
    builderAddress: "0x7777...8888",
    builderName: "DevGardener",
    requestedAt: "1 day ago",
    status: "pending",
  },
  {
    id: 2,
    ideaTitle: "ZK Bloom Verification",
    builderAddress: "0x9999...0000",
    builderName: "PrivacyBuilder",
    requestedAt: "3 hours ago",
    status: "pending",
  },
]

const duplicateReports = [
  {
    id: 1,
    newIdeaTitle: "Yield Farming Garden",
    existingIdeaTitle: "DeFi Garden Protocol",
    reportedBy: "0x1111...2222",
    similarity: 85,
    reportedAt: "6 hours ago",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending")

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
                  Garden Keeper Dashboard
                </h1>
                <p className="text-sm text-emerald-600/70">Nurturing the community garden</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                <Flower2 className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600/70">Pending Ideas</p>
                  <p className="text-2xl font-bold text-emerald-900">{pendingIdeas.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600/70">Builder Requests</p>
                  <p className="text-2xl font-bold text-emerald-900">{builderRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600/70">Duplicate Reports</p>
                  <p className="text-2xl font-bold text-emerald-900">{duplicateReports.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600/70">Total Ideas</p>
                  <p className="text-2xl font-bold text-emerald-900">47</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/80 border border-emerald-200">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              Pending Ideas ({pendingIdeas.length})
            </TabsTrigger>
            <TabsTrigger
              value="builders"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              Builder Requests ({builderRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="duplicates"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              Duplicates ({duplicateReports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingIdeas.map((idea) => (
              <Card key={idea.id} className="border-emerald-100 bg-white/80 backdrop-blur-sm">
                <div className="h-1 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 mb-2">{idea.title}</h3>
                      <p className="text-emerald-800/80 mb-3 line-clamp-2">{idea.description}</p>
                      <div className="flex items-center gap-3 text-sm text-emerald-600/70 mb-3">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                            {idea.author.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{idea.author}</span>
                        <span>•</span>
                        <span>{idea.submittedAt}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {idea.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent">
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="builders" className="space-y-4">
            {builderRequests.map((request) => (
              <Card key={request.id} className="border-emerald-100 bg-white/80 backdrop-blur-sm">
                <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-emerald-900 mb-2">{request.ideaTitle}</h3>
                      <div className="flex items-center gap-3 text-sm text-emerald-600/70 mb-4">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {request.builderName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{request.builderName}</span>
                        <span>({request.builderAddress})</span>
                        <span>•</span>
                        <span>{request.requestedAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                        <Check className="w-4 h-4 mr-2" />
                        Approve Builder
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent">
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="duplicates" className="space-y-4">
            {duplicateReports.map((report) => (
              <Card key={report.id} className="border-emerald-100 bg-white/80 backdrop-blur-sm">
                <div className="h-1 bg-gradient-to-r from-red-400 to-pink-400"></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-red-700">Potential Duplicate Detected</span>
                        <Badge variant="outline" className="border-red-200 text-red-700">
                          {report.similarity}% Similar
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-emerald-900">
                          <span className="font-medium">New:</span> {report.newIdeaTitle}
                        </p>
                        <p className="text-emerald-900">
                          <span className="font-medium">Existing:</span> {report.existingIdeaTitle}
                        </p>
                        <p className="text-sm text-emerald-600/70">
                          Reported by {report.reportedBy} • {report.reportedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                        Merge Ideas
                      </Button>
                      <Button
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                      >
                        Keep Separate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
