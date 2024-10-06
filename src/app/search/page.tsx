'use client'

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation" // Import hooks to manage URL and query params
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, List, Grid, LayoutGrid, SortAsc, SortDesc } from "lucide-react"
import { IVN, IVNFilters } from "@/types/vn"
import { Range } from "@/components/ui/range"
import { IVNSort } from "@/types/vn"
import useDebouncedSearch from "@/hooks/use-debounced-search"
import { getVnBySearch } from "@/lib/vndb/search"
import Link from "next/link"
import VNCard, { VNCardSkeleton } from "@/components/vn-card"
import { useAuth } from "@/components/auth-provider"
import VNCompact, { VNCompactSkeleton } from "@/components/vn-compact"
import VNRow from "@/components/vn-row"

type ViewMode = "list" | "card" | "compact"

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<IVN[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sort, setSort] = useState<IVNSort>({ type: "rating", asc: false })
  const [filters, setFilters] = useState<IVNFilters>({ rating: [1, 10] })

  const search = useDebouncedSearch([searchTerm, filters, sort])

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get("q") || "" // Get the 'q' param from URL
    setSearchTerm(query) // Set searchTerm based on query param
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      if (searchTerm) {
        setIsLoading(true)
        const res = await getVnBySearch(search[0], search[1], search[2])

        setSearchResults(res)
        setIsLoading(false)
      } else {
        setSearchResults([])
      }
    }

    router.push(`?q=${searchTerm}`)

    fetchData()
  }, [search])

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    // Update the URL with the new search term
  }

  const SkeletonListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cover</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Release Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-[75px] w-[50px]" /></TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px] mt-2" />
            </TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderListView = () => (
    isLoading ? <SkeletonListView /> : (
      <Table>
        <TableHeader>
          <TableHead>Cover</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Release Date</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableHeader>
        <TableBody>
          {searchResults.map((vn: IVN, id: number) => (
            <VNRow key={id} vnData={vn} fields={[vn.released]} rating={vn.rating} />
          ))}
        </TableBody>
      </Table >
    )
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isLoading ? <VNCardSkeleton /> : (
        searchResults.map((vn: IVN, id: number) => (
          <Link href={"/novel/" + vn.id}>
            <VNCard key={id} vnData={vn} rating={vn.rating!} date={vn.released} />
          </Link>
        ))
      )}
    </div>
  )

  const renderCompactView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2">
      {isLoading ? (
        <VNCompactSkeleton />
      ) : (
        searchResults.map((vn: IVN, id: number) => (
          <VNCompact key={id} vnData={vn} rating={vn.rating} />
        ))
      )}
    </div>
  )

  return (
    <div className="container mx-auto py-8  max-w-screen-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Search Visual Novels</h1>
        <div className="hidden md:block">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <ToggleGroupItem value="list" aria-label="List View">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="card" aria-label="Card View">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="compact" aria-label="Compact View">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="flex flex-col lg:items-end lg:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <div className="flex items-center space-x-2 w-full">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search visual novels..."
              value={searchTerm}
              onChange={handleSearchInput} // Updated to handle input change and update URL
              className="w-full"
            />
          </div>
        </div>
        <div className="flex-grow">
          <Label>Rating Range</Label>
          <div className="flex items-center mt-2 space-x-4">
            <Input
              type="number"
              min={1}
              max={10}
              step={0.1}
              value={filters?.rating![0]}
              onChange={(e) => setFilters({ ...filters, rating: [parseFloat(e.target.value), filters.rating![1]] })}
              className="w-20"
            />
            <Range
              min={1}
              max={10}
              step={0.1}
              value={filters.rating}
              defaultValue={[0.5, 0.6]}
              onValueChange={(e) => setFilters({ rating: e })}
              className="flex-grow"
            />
            <Input
              type="number"
              min={1}
              max={10}
              step={0.1}
              value={filters.rating![1]}
              onChange={(e) => setFilters({ rating: [filters.rating![0], parseFloat(e.target.value)] })}
              className="w-20"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Select value={sort.type} onValueChange={(value: "title" | "rating" | "releaseDate") => setSort({ type: value, asc: sort.asc })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="releaseDate">Release Date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setSort({ asc: !sort.asc, type: sort.type })}>
              {sort.asc === true ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
          <div className="md:hidden">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <ToggleGroupItem value="list" aria-label="List View">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Card View">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="compact" aria-label="Compact View">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
      <div>
        {viewMode === "list" && renderListView()}
        {viewMode === "card" && renderCardView()}
        {viewMode === "compact" && renderCompactView()}
      </div>
    </div>
  )
}
