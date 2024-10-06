"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Star, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data (replace with actual data fetching in a real application)
const recentUpdates = [
  { id: 1, user: "Alice", novel: "Steins;Gate", status: "Completed", rating: 9.5, cover: "/placeholder.svg?height=150&width=100" },
  { id: 2, user: "Bob", novel: "Clannad", status: "Reading", progress: "60%", cover: "/placeholder.svg?height=150&width=100" },
  { id: 3, user: "Charlie", novel: "Fate/stay night", status: "On Hold", rating: 8.0, cover: "/placeholder.svg?height=150&width=100" },
  { id: 4, user: "Diana", novel: "Muv-Luv Alternative", status: "Completed", rating: 10, cover: "/placeholder.svg?height=150&width=100" },
  { id: 5, user: "Ethan", novel: "Umineko", status: "Reading", progress: "30%", cover: "/placeholder.svg?height=150&width=100" },
]

const trendingNovels = [
  { id: 1, title: "The House in Fata Morgana", rating: 9.2, cover: "/placeholder.svg?height=300&width=200" },
  { id: 2, title: "Saya no Uta", rating: 8.7, cover: "/placeholder.svg?height=300&width=200" },
  { id: 3, title: "Katawa Shoujo", rating: 8.5, cover: "/placeholder.svg?height=300&width=200" },
  { id: 4, title: "Planetarian", rating: 8.3, cover: "/placeholder.svg?height=300&width=200" },
]

const newReleases = [
  { id: 1, title: "Tsukihime -A piece of blue glass moon-", releaseDate: "2021-08-26", cover: "/placeholder.svg?height=300&width=200" },
  { id: 2, title: "Chaos;Head Noah", releaseDate: "2022-10-07", cover: "/placeholder.svg?height=300&width=200" },
  { id: 3, title: "AI: The Somnium Files - nirvanA Initiative", releaseDate: "2022-06-24", cover: "/placeholder.svg?height=300&width=200" },
  { id: 4, title: "Loopers", releaseDate: "2022-05-02", cover: "/placeholder.svg?height=300&width=200" },
]

export default function FrontPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Create your VNVault</h2>
          <Link href="/signup">
            <Button size="lg" className="px-8">Sign up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}