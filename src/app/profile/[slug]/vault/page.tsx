'use client'

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, SortAsc, SortDesc, List, Grid, LayoutGrid } from "lucide-react"
import { IVaultStatus, IVNVaultEntry } from "@/types/vault"
import { IVN } from "@/types/vn"
import { useAuth } from "@/components/auth-provider"
import VaultEdit from "@/components/vault-edit"
import VNCard, { VNCardSkeleton } from "@/components/vn-card"
import VNCompact, { VNCompactSkeleton } from "@/components/vn-compact"
import VNRow from "@/components/vn-row"
import useIsMe from "@/hooks/use-is-me"

type ViewMode = "list" | "card" | "compact"

export default function VaultPage({ params }: { params: { slug: string } }) {
    const [viewMode, setViewMode] = useState<ViewMode>("list")
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState<keyof IVNVaultEntry | keyof IVN>("rating")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [statusFilter, setStatusFilter] = useState<IVaultStatus | "All">("All")
    const [entryData, setEntryData] = useState<IVNVaultEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const auth = useAuth()
    const isMe = useIsMe(params.slug)

    useEffect(() => {
        async function fetchData() {
            const res = await auth.db.users.getUserProfileByName(params.slug)

            setEntryData(res.vault?.entries! || [])
            setIsLoading(false)
        }
        fetchData()
    }, [auth, params.slug])

    const filteredAndSortedEntries = useMemo(() => {
        return entryData
            .filter(entry =>
                (entry.vn.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (statusFilter === "All" || entry.status === statusFilter)
            )
            .sort((a, b) => {
                const getSortValue = (entry: IVNVaultEntry, key: keyof IVNVaultEntry | keyof IVN) => {
                    if (key in entry) {
                        return entry[key as keyof IVNVaultEntry];
                    } else if (key in entry.vn) {
                        return entry.vn[key as keyof IVN];
                    }
                }

                const valueA = getSortValue(a, sortBy);
                const valueB = getSortValue(b, sortBy);

                if (valueA === undefined || valueB === undefined) return 0; 

                if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
                if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
    }, [entryData, searchTerm, sortBy, sortOrder, statusFilter])

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    const SkeletonListView = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead></TableHead>
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
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-[50px] ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
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
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Last Updated</TableHead>
                    <TableHead className="text-center">Created Date</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedEntries.map((entry, id: number) => (
                        <VNRow key={id} vnData={entry.vn} rating={entry.rating} entry={entry} isMe={isMe} fields={[entry.status, new Date(entry.updatedAt).toLocaleDateString(), new Date(entry.createdAt).toLocaleDateString()]} />
                    ))}
                </TableBody>
            </Table>
        )
    )

    const renderCardView = () => (
        isLoading ? <VNCardSkeleton /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedEntries.map((entry, id: number) => (
                    <VNCard key={id} vnData={entry.vn} entry={entry} isMe={isMe} date={new Date(entry.updatedAt).toLocaleDateString()} rating={entry.rating} badgeText={entry.status} />
                ))}
            </div>
        )
    )

    const renderCompactView = () => (
        isLoading ? <VNCompactSkeleton /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
                {filteredAndSortedEntries.map((entry, id: number) => (
                    <VNCompact key={id} vnData={entry.vn} entry={entry} isMe={isMe} rating={entry.rating} imageText={entry.status} />
                ))}
            </div>
        )
    )

    return (
        <div className="w-full py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-3xl font-bold">{params.slug + "'s VNVault"}</h1>
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
            <div className="flex flex-col space-y-4 mb-6">
                <div className="flex items-center space-x-2 w-full">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search visual novels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof IVN)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="updatedAt">Last Updated</SelectItem>
                            <SelectItem value="createdAt">Created Date</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={toggleSortOrder}>
                        {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                        {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </Button>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as IVaultStatus | "All")}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value={IVaultStatus.Finished}>{IVaultStatus.Finished}</SelectItem>
                            <SelectItem value={IVaultStatus.Reading}>{IVaultStatus.Reading}</SelectItem>
                            <SelectItem value={IVaultStatus.Dropped}>{IVaultStatus.Dropped}</SelectItem>
                            <SelectItem value={IVaultStatus.ToRead}>{IVaultStatus.ToRead}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {viewMode === "list" && renderListView()}
            {viewMode === "card" && renderCardView()}
            {viewMode === "compact" && renderCompactView()}
        </div>
    )
}