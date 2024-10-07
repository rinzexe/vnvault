'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, List, Grid, LayoutGrid, SortAsc, SortDesc } from "lucide-react"
import { IVN, IVNFilters } from "@/types/vn"
import { Range } from "@/components/ui/range"
import { IVNSort } from "@/types/vn"
import useDebouncedSearch from "@/hooks/use-debounced-search"
import { getCharacterBySearch, getDeveloperBySearch, getVnBySearch } from "@/lib/vndb/search"
import Link from "next/link"
import VNCard, { VNCardSkeleton } from "@/components/vn-card"
import VNCompact, { VNCompactSkeleton } from "@/components/vn-compact"
import VNRow from "@/components/vn-row"
import { ICharacter } from "@/types/character"
import NSFWImage from "@/components/nsfw-image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/auth-provider"
import { IUserProfile } from "@/types/user-profile"
import { IDeveloper } from "@/types/developer"

type ViewMode = "list" | "card" | "compact"
type SearchType = "visual novels" | "characters" | "users" | "developers"

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchType, setSearchType] = useState<SearchType>("visual novels")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<IVN[] | ICharacter[] | IUserProfile[] | IDeveloper[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sort, setSort] = useState<IVNSort>({ type: "rating", asc: false })
  const [filters, setFilters] = useState<IVNFilters>({ rating: [1, 10] })

  const search = useDebouncedSearch([searchTerm, filters, sort])

  const router = useRouter()
  const searchParams = useSearchParams()

  const auth = useAuth()

  useEffect(() => {
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") as SearchType || "visual novels"
    setSearchTerm(query)
    setSearchType(type)
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (searchTerm) {
        setIsLoading(true)

        let res: IVN[] | ICharacter[] | IUserProfile[] | IDeveloper[];
        switch (searchType) {
          case "visual novels":
            res = await getVnBySearch(search[0], search[1], search[2])
            break;
          case "characters":
            res = await getCharacterBySearch(search[0]) as ICharacter[]
            break;
          case "users":
            res = await auth.db.users.getUsersBySearch(search[0])
            break;
          case "developers":
            res = await getDeveloperBySearch(search[0])
            break;
        }

        setSearchResults(res || [])
        setIsLoading(false)
      } else {
        setSearchResults([])
      }
    }
    setSearchResults([])
    router.push(`?q=${searchTerm}&type=${searchType}`)
    fetchData()
  }, [search, searchType])

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const SkeletonListView = () => (
    <Table>
      <TableHeader>
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

  const renderVNListView = () => (
    isLoading ? <SkeletonListView /> : (
      <Table>
        <TableHeader>
          <TableHead>Cover</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Release Date</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableHeader>
        <TableBody>
          {(searchResults as IVN[]).map((vn: IVN, id: number) => (
            <VNRow key={id} vnData={vn} fields={[vn.released]} rating={vn.rating} />
          ))}
        </TableBody>
      </Table>
    )
  )

  const renderCharacterListview = () => (
    isLoading ? <SkeletonListView /> : (
      <Table>
        <TableHeader>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
        </TableHeader>
        <TableBody>
          {(searchResults as ICharacter[]).map((character: ICharacter) => (
            <Link key={character.id} href={"/character/" + character.id} passHref legacyBehavior>
              <TableRow className="hover:cursor-pointer">
                <TableCell className="w-20">
                  {character.image.url && (
                    <NSFWImage
                      imageUrl={character.image.url}
                      resolution={character.image.resolution}
                      isNsfw={character.image.nsfw}
                      className="w-20 h-30 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{character.name}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {character.vns.slice(0, 3).map((vn, index) => (
                      <Image
                        key={index}
                        src={vn?.cover?.url || '/placeholder.svg'}
                        alt={vn.title}
                        width={40}
                        height={60}
                        className="object-cover rounded"
                      />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    )
  )

  const renderVNCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isLoading ? <VNCardSkeleton /> : (
        (searchResults as IVN[]).map((vn: IVN, id: number) => (
          <Link key={id} href={"/novel/" + vn.id}>
            <VNCard vnData={vn} rating={vn.rating!} date={vn.released} />
          </Link>
        ))
      )}
    </div>
  )

  const renderVNCompactView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2">
      {isLoading ? (
        <VNCompactSkeleton />
      ) : (
        (searchResults as IVN[]).map((vn: IVN, id: number) => (
          <VNCompact key={id} vnData={vn} rating={vn.rating} />
        ))
      )}
    </div>
  )

  const renderUserListView = () => (
    isLoading ? <SkeletonListView /> : (
      <Table>
        <TableHeader>
          <TableHead>Avatar</TableHead>
          <TableHead>Name</TableHead>
        </TableHeader>
        <TableBody>
          {(searchResults as IUserProfile[]).map((user: IUserProfile) => (
            <Link key={user.uuid} href={"/profile/" + user.username} passHref legacyBehavior>
              <TableRow className="hover:cursor-pointer">
                <TableCell className="w-20">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{user.username}</div>
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    )
  )

  const renderDeveloperListView = () => (
    isLoading ? <SkeletonListView /> : (
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
        </TableHeader>
        <TableBody>
          {(searchResults as IDeveloper[]).map((developer: IDeveloper) => (
            <Link key={developer.id} href={"/developer/" + developer.id} passHref legacyBehavior>
              <TableRow className="hover:cursor-pointer">
                <TableCell>
                  <div className="font-medium">{developer.name}</div>
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    )
  )

  return (
    <div className="container mx-auto py-8 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Search</h1>
        {searchType === "visual novels" && (
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
        )}
      </div>

      <ScrollArea dir="rtl">
        <Tabs value={searchType} onValueChange={(value) => { setSearchType(value as SearchType); setSearchResults([]) }} className="mb-6">
          <TabsList>
            <TabsTrigger value="visual novels">Visual Novels</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="developers">Developers</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center space-x-2 w-full">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder={`Search ${searchType}...`}
            value={searchTerm}
            onChange={handleSearchInput}
            className="w-full"
          />
        </div>

        {searchType === "visual novels" && (
          <div className="flex flex-col lg:flex-row gap-4">
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
                  defaultValue={[1, 10]}
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
            <div className="flex items-end gap-2">
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
                {sort.asc ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
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
        )}
      </div>

      <div>
        {searchResults.length > 0 || isLoading ? (
          searchType === "visual novels" ? (
            <div>
              {viewMode === "list" && renderVNListView()}
              {viewMode === "card" && renderVNCardView()}
              {viewMode === "compact" && renderVNCompactView()}
            </div>
          ) :
            searchType === "characters" ? renderCharacterListview() :
              searchType === "users" ? renderUserListView() :
                searchType === "developers" && (
                  renderDeveloperListView()
                )
        )
          :
          isLoading == false && "No search results o(╥﹏╥)o"}
      </div>
    </div>
  )
}