"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getDeveloperById, getVnByDeveloperId } from "@/lib/vndb/search"
import { IDeveloper } from "@/types/developer"
import { IVN } from "@/types/vn"
import Rating from "@/components/ui/rating"
import Description from "@/components/description"

export default function DeveloperPage({ params }: { params: { slug: number } }) {
    const [loading, setLoading] = useState(true)
    const [developerData, setDeveloperData] = useState<IDeveloper | null>(null)
    const [displayedVNs, setDisplayedVNs] = useState(5)

    useEffect(() => {
        async function fetchData() {
            const developerRes: IDeveloper = await getDeveloperById(params.slug)

            let vnRes: IVN[] = await getVnByDeveloperId(params.slug)

            setDeveloperData({ vns: vnRes, ...developerRes })
            setLoading(false)
        }

        fetchData()
    }, [params.slug])

    const loadMoreVNs = () => {
        setDisplayedVNs(prev => Math.min(prev + 5, developerData?.vns?.length || 0))
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "co":
                return "Company"
            case "in":
                return "Individual"
            case "ng":
                return "Amateur group"
            default:
                return "Unknown"
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "co":
                return "bg-primary text-primary-foreground"
            case "in":
                return "bg-secondary text-secondary-foreground"
            case "ng":
                return "bg-accent text-accent-foreground"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <div className="min-h-screen py-4 space-y-8 w-full">
            <div className="container mx-auto rounded-lg md:p-8 p-2">
                <div className="flex flex-col md:flex-row md:gap-8 gap-4 justify-between items-start mb-8">
                    <div className="w-full md:w-2/3 space-y-6">
                        {loading ? (
                            <Skeleton className="h-10 w-64" />
                        ) : (
                            <h1 className="text-4xl font-bold mb-2">{developerData?.name}</h1>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div>
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ) : (
                                    <Description text={developerData?.description || "No description available."} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-full md:w-1/3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">Quick Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {loading ? (
                                    <div>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Type: </strong>
                                            <Badge className={getTypeColor(developerData?.type || "")}>
                                                {getTypeLabel(developerData?.type || "")}
                                            </Badge>
                                        </p>
                                        <p><strong>Visual Novels: </strong>{developerData?.vns?.length || 0}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Visual Novels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array(5).fill(null).map((_, index) => (
                                    <Skeleton key={index} className="h-28 w-full" />
                                ))}
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {developerData?.vns?.slice(0, displayedVNs).map((vn: IVN) => (
                                        <Link href={`/novel/${vn.id}`} key={vn.id}>
                                            <Card className="hover:bg-muted/50 transition-colors">
                                                <CardContent className="p-4 flex justify-between items-center space-x-4">
                                                    <Image
                                                        src={vn.cover?.url || '/placeholder.svg'}
                                                        alt={vn.title}
                                                        width={60}
                                                        height={90}
                                                        className="rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">{vn.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{vn.released || "Release date unknown"}</p>
                                                    </div>
                                                    <Rating rating={vn.rating!} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                                {displayedVNs < (developerData?.vns?.length || 0) && (
                                    <Button
                                        onClick={loadMoreVNs}
                                        className="mt-4 w-full"
                                    >
                                        Load More Visual Novels
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}