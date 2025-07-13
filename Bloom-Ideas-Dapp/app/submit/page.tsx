// app/submit/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import UniversalWalletConnection from "@/components/universal-wallet-connection"
import ReactMarkdown from "react-markdown"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import {
  ArrowLeft,
  Flower2,
  Sparkles,
  Link as LinkIcon,
  Upload,
} from "lucide-react"
import { SeasonalBackground, FloatingGardenElements, GardenWeather } from "@/components/garden-elements"

interface Category { id: number; name: string }
interface TechStack { id: number; name: string }

export default function SubmitIdeaPage() {
  const router = useRouter()

  // Loaded from Supabase
  const [categories, setCategories] = useState<Category[]>([])
  const [techStacks, setTechStacks] = useState<TechStack[]>([])

  // User & form state
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryIds: [] as number[],
    techStackIds: [] as number[],
    links: [] as { url: string; label: string }[],
    visuals: [] as { url: string; alt: string }[],
  })
  const [submitting, setSubmitting] = useState(false)

  // Load categories & techStacks once
  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name")
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error
        if (data) setCategories(data)
      })
    supabase
      .from("tech_stacks")
      .select("id,name")
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error
        if (data) setTechStacks(data)
      })
  }, [])

  // Wallet connection callback
  const handleWalletConnectionChange = (connected: boolean, address?: string) => {
    if (connected && address) setWalletAddress(address)
    else setWalletAddress("")
  }

  // Toggle helpers
  const toggleCategory = (id: number) => {
    setFormData((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }))
  }
  const toggleTechStack = (id: number) => {
    setFormData((f) => ({
      ...f,
      techStackIds: f.techStackIds.includes(id)
        ? f.techStackIds.filter((t) => t !== id)
        : [...f.techStackIds, id],
    }))
  }

  // Add / remove dynamic links & visuals
  const addLink = () =>
    setFormData((f) => ({ ...f, links: [...f.links, { url: "", label: "" }] }))
  const updateLink = (idx: number, key: "url" | "label", val: string) =>
    setFormData((f) => {
      const l = [...f.links]
      l[idx] = { ...l[idx], [key]: val }
      return { ...f, links: l }
    })
  const removeLink = (idx: number) =>
    setFormData((f) => {
      const l = f.links.filter((_, i) => i !== idx)
      return { ...f, links: l }
    })

  const addVisual = () =>
    setFormData((f) => ({ ...f, visuals: [...f.visuals, { url: "", alt: "" }] }))
  const updateVisual = (idx: number, key: "url" | "alt", val: string) =>
    setFormData((f) => {
      const v = [...f.visuals]
      v[idx] = { ...v[idx], [key]: val }
      return { ...f, visuals: v }
    })
  const removeVisual = (idx: number) =>
    setFormData((f) => ({
      ...f,
      visuals: f.visuals.filter((_, i) => i !== idx),
    }))

  // Submission
  const handleSubmit = async () => {
    if (!walletAddress) {
      toast.error("Connect your wallet first")
      return
    }
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title & description are required")
      return
    }
    if (formData.categoryIds.length === 0) {
      toast.error("Select at least one category")
      return
    }

    setSubmitting(true)
    try {
      // 1) Insert project
      const { data: proj, error: projErr } = await supabase
        .from("projects")
        .insert({
          owner_address: walletAddress,
          title: formData.title,
          description: formData.description,
        })
        .select("id")
        .single()
      if (projErr || !proj?.id) throw projErr ?? new Error("No project ID")

      const pid = proj.id

      // 2) Link categories
      await Promise.all(
        formData.categoryIds.map((cid) =>
          supabase.from("project_categories").insert({ project_id: pid, category_id: cid })
        )
      )

      // 3) Link tech stacks
      await Promise.all(
        formData.techStackIds.map((tid) =>
          supabase.from("project_tech_stacks").insert({ project_id: pid, tech_stack_id: tid })
        )
      )

      // 4) Insert related links
      await Promise.all(
        formData.links.map(({ url, label }) =>
          supabase.from("project_links").insert({ project_id: pid, url, label })
        )
      )

      // 5) Insert visuals
      await Promise.all(
        formData.visuals.map(({ url, alt }) =>
          supabase.from("project_visuals").insert({ project_id: pid, url, alt_text: alt })
        )
      )

      toast.success("Your idea has been planted! 🌱")
      router.push("/") // back to garden
    } catch (e) {
      console.error(e)
      toast.error("Failed to submit idea")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-emerald-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
          <UniversalWalletConnection onConnectionChange={handleWalletConnectionChange} />
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
          <div className="max-w-md mx-auto mt-6">
            <GardenWeather />
          </div>
        </div>

        {/* Form */}
        <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
          <CardHeader>
            <h2 className="text-xl font-semibold text-emerald-900">Idea Details</h2>
            <p className="text-emerald-700/70">Fill in the details to help your idea flourish</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-emerald-800 font-medium">
                Project Title *
              </Label>
              <Input
                id="title"
                placeholder="Give your idea a memorable name..."
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-emerald-800 font-medium">
                Description *
              </Label>
              <Tabs defaultValue="edit" className="w-full mt-2">
                <TabsList className="bg-emerald-50 mb-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    id="description"
                    placeholder="Describe your idea in detail... (Markdown supported)"
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-400 font-mono min-h-[120px]"
                    rows={6}
                  />
                  <div className="text-xs text-emerald-600 mt-1">
                    <span className="font-semibold">Tip:</span> Use Markdown for formatting. For a great description, include:
                    <ul className="list-disc ml-5">
                      <li>What problem does your idea solve?</li>
                      <li>How does it work? (features, tech, vision)</li>
                      <li>Who is it for? (target users, impact)</li>
                      <li>What makes it unique?</li>
                      <li>Use <code>**bold**</code>, <code># headings</code>, <code>- lists</code>, <code>[links](url)</code>, etc.</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="prose prose-emerald max-w-none bg-emerald-50/50 p-4 rounded-md border border-emerald-100 min-h-[120px]">
                    {formData.description.trim() ? (
                      <ReactMarkdown>{formData.description}</ReactMarkdown>
                    ) : (
                      <span className="text-emerald-400">Nothing to preview yet. Start writing your idea description in Markdown!</span>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Categories */}
            <div>
              <Label className="text-emerald-800 font-medium">Categories *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg border ${
                      formData.categoryIds.includes(cat.id)
                        ? "bg-emerald-100 border-emerald-300"
                        : "border-emerald-200"
                    } cursor-pointer`}
                  >
                    <Checkbox
                      checked={formData.categoryIds.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <span className="text-emerald-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <Label className="text-emerald-800 font-medium">Tech Stack</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {techStacks.map((tech) => (
                  <label
                    key={tech.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg border ${
                      formData.techStackIds.includes(tech.id)
                        ? "bg-emerald-100 border-emerald-300"
                        : "border-emerald-200"
                    } cursor-pointer`}
                  >
                    <Checkbox
                      checked={formData.techStackIds.includes(tech.id)}
                      onCheckedChange={() => toggleTechStack(tech.id)}
                    />
                    <span className="text-emerald-700">{tech.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Related Links */}
            <div>
              <Label className="text-emerald-800 font-medium">Related Links</Label>
              <div className="space-y-2 mt-2">
                {formData.links.map((lnk, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="URL"
                      value={lnk.url}
                      onChange={(e) => updateLink(idx, "url", e.target.value)}
                      className="flex-1 border-emerald-200"
                    />
                    <Input
                      placeholder="Label (optional)"
                      value={lnk.label}
                      onChange={(e) => updateLink(idx, "label", e.target.value)}
                      className="flex-1 border-emerald-200"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => removeLink(idx)}
                      className="text-red-500"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addLink}>
                  <LinkIcon className="mr-2" /> Add Link
                </Button>
              </div>
            </div>

            {/* Mockups & Visuals */}
            <div>
              <Label className="text-emerald-800 font-medium">Mockups & Visuals</Label>
              <div className="space-y-2 mt-2">
                {formData.visuals.map((v, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      value={v.url}
                      onChange={(e) => updateVisual(idx, "url", e.target.value)}
                      className="flex-1 border-emerald-200"
                    />
                    <Input
                      placeholder="Alt text"
                      value={v.alt}
                      onChange={(e) => updateVisual(idx, "alt", e.target.value)}
                      className="flex-1 border-emerald-200"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => removeVisual(idx)}
                      className="text-red-500"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addVisual}>
                  <Upload className="mr-2" /> Add Visual
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                disabled={submitting}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {submitting ? "Planting..." : "Plant Idea in Garden"}
              </Button>
              <Button variant="outline" className="border-emerald-200 text-emerald-700">
                Save Draft
              </Button>
            </div>

            <p className="text-sm text-emerald-600/70 text-center mt-4">
              Your idea will be reviewed by our garden keepers before blooming publicly
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
