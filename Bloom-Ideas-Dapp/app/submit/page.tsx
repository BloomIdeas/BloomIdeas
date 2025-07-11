"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Flower2, Sparkles, Upload } from "lucide-react"
import Link from "next/link"

const availableTags = ["DeFi", "ZK", "NFT", "AI", "Tooling", "SDK", "Gaming", "Social", "Infrastructure", "Privacy"]
const techStackOptions = [
  "Solidity",
  "React",
  "Node.js",
  "Python",
  "Rust",
  "Go",
  "TypeScript",
  "IPFS",
  "GraphQL",
  "PostgreSQL",
]

export default function SubmitIdeaPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    techStack: [] as string[],
    pastLinks: "",
    mockups: [] as File[],
  })

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const handleTechStackToggle = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech) ? prev.techStack.filter((t) => t !== tech) : [...prev.techStack, tech],
    }))
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
                <span className="font-semibold text-emerald-800">Plant New Idea</span>
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Plant Your Vision</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Share Your Blooming Idea
          </h1>
          <p className="text-emerald-700/80 max-w-2xl mx-auto">
            Every great innovation starts as a seed. Plant your idea in our garden and watch the community help it grow.
          </p>
        </div>

        <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
          <CardHeader>
            <h2 className="text-xl font-semibold text-emerald-900">Idea Details</h2>
            <p className="text-emerald-700/70">Fill in the details to help your idea flourish</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-emerald-800 font-medium">
                Project Title *
              </Label>
              <Input
                id="title"
                placeholder="Give your idea a memorable name..."
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-emerald-800 font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your idea in detail. What problem does it solve? How does it work? What makes it special?"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[120px] border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-emerald-800 font-medium">Categories *</Label>
              <p className="text-sm text-emerald-700/70">Select all that apply to help others discover your idea</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={formData.tags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                      className="border-emerald-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label
                      htmlFor={tag}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.tags.includes(tag)
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-emerald-50"
                      }`}
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <Label className="text-emerald-800 font-medium">Tech Stack</Label>
              <p className="text-sm text-emerald-700/70">What technologies will you use?</p>
              <div className="flex flex-wrap gap-2">
                {techStackOptions.map((tech) => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={tech}
                      checked={formData.techStack.includes(tech)}
                      onCheckedChange={() => handleTechStackToggle(tech)}
                      className="border-emerald-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label
                      htmlFor={tech}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.techStack.includes(tech)
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-emerald-50"
                      }`}
                    >
                      {tech}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Links */}
            <div className="space-y-2">
              <Label htmlFor="pastLinks" className="text-emerald-800 font-medium">
                Related Links
              </Label>
              <Input
                id="pastLinks"
                placeholder="Any existing implementations, research papers, or related projects?"
                value={formData.pastLinks}
                onChange={(e) => setFormData((prev) => ({ ...prev, pastLinks: e.target.value }))}
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>

            {/* Mockups Upload */}
            <div className="space-y-3">
              <Label className="text-emerald-800 font-medium">Mockups & Visuals</Label>
              <p className="text-sm text-emerald-700/70">
                Upload images, wireframes, or diagrams to help visualize your idea
              </p>
              <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 text-center hover:border-emerald-300 transition-colors">
                <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-emerald-700 mb-2">Drag & drop files here, or click to browse</p>
                <Button
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Plant Idea in Garden
              </Button>
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                Save Draft
              </Button>
            </div>

            <p className="text-sm text-emerald-600/70 text-center">
              Your idea will be reviewed by our garden keepers before blooming publicly
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
