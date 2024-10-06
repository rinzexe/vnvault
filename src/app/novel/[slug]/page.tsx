"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, Edit, ExternalLink, Star } from "lucide-react"
import { getCharactersByVnId, getVnById } from "@/lib/vndb/search"
import { IVN } from "@/types/vn"
import { ICharacter } from "@/types/character"
import { formatDescription } from "@/lib/vndb/utils"

interface IVNData extends IVN {
    characters: ICharacter[]
}

export default function VisualNovelInfoPage({ params }: { params: { slug: number } }) {
    const [loading, setLoading] = useState(true)
    const [vnData, setVnData] = useState<IVNData | null>(null)
    const [displayedCharacters, setDisplayedCharacters] = useState(10)

    useEffect(() => {
        async function fetchData() {
            const vnRes: IVN = await getVnById(params.slug)
            const characterRes: ICharacter[] = await getCharactersByVnId(params.slug)

            setVnData({ characters: characterRes, ...vnRes })

            setLoading(false)
        }
        fetchData()
    }, [])

    const loadMoreCharacters = () => {
        setDisplayedCharacters(prev => Math.min(prev + 10, vnData?.characters.length || 0))
    }

    return (
        <div className="min-h-screen py-4 space-y-8 w-full">
            <div className="container mx-auto rounded-lg md:p-8 p-2">
                <div className="flex md:flex-row flex-col md:gap-0 gap-4 justify-between items-start mb-8">
                    <div>
                        {loading ? (
                            <Skeleton className="h-10 w-64" />
                        ) : (
                            <h1 className="text-4xl font-bold mb-2">{vnData?.title}</h1>
                        )}
                        {loading ? (
                            <Skeleton className="h-6 w-48 mt-2" />
                        ) : (
                            <p className="text-xl">{vnData?.altTitle}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Vault
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        {loading ? (
                            <Skeleton className="w-full h-[600px]" />
                        ) : (
                            <Image
                                src={vnData?.cover.url}
                                alt={`${vnData?.title} cover`}
                                width={400}
                                height={600}
                                className="w-full rounded-lg"
                            />
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">Quick Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {loading ? (
                                    <div>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p>
                                                <strong>Rating: </strong>
                                            </p>
                                            <Badge>
                                                {vnData?.rating}
                                            </Badge>
                                            <p className="text-muted-foreground text-xs">
                                                <i>{"(" + vnData?.rateCount + ")"}</i>
                                            </p>
                                        </div>
                                        <p><strong>Developer(s): </strong>
                                            <span>
                                                {vnData?.developers?.map((developer: any, id: number) => (
                                                    <span key={id}>
                                                        {developer.name}
                                                    </span>
                                                )) || "Not found"}
                                            </span>
                                        </p>
                                        <p><strong>Status: </strong>
                                            <span>
                                                {getStatusName(vnData?.devStatus || 0)}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div>
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ) : (
                                    <p className="leading-relaxed">{formatDescription(vnData?.description || "a")}</p>
                                )}
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="characters" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="characters" className="w-1/2">Characters</TabsTrigger>
                                <TabsTrigger value="screenshots" className="w-1/2">Screenshots</TabsTrigger>
                            </TabsList>
                            <TabsContent value="characters" className="mt-4 space-y-4">
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Array(10).fill(null).map((_, index) => (
                                            <Skeleton key={index} className="h-28 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {vnData?.characters.slice(0, displayedCharacters).map((character) => (
                                                <Card key={character.name}>
                                                    <CardContent className="p-4 flex justify-center h-full items-center space-x-4">
                                                        <Image
                                                            src={character.image?.url}
                                                            alt={character.name}
                                                            width={80}
                                                            height={120}
                                                            className="rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold">{character.name}</h3>
                                                            <p className="text-sm line-clamp-2">{formatDescription(character.description || "a")}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                        {displayedCharacters < (vnData?.characters.length || 0) && (
                                            <Button
                                                onClick={loadMoreCharacters}
                                                className="mt-4 w-full"
                                            >
                                                Load More Characters
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="screenshots" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {loading ? (
                                        <div>
                                            <Skeleton className="h-40 w-full" />
                                            <Skeleton className="h-40 w-full" />
                                            <Skeleton className="h-40 w-full" />
                                            <Skeleton className="h-40 w-full" />
                                        </div>
                                    ) : (
                                        vnData?.screenshots.map((screenshot: any, index: any) => (
                                            <Image
                                                key={index}
                                                src={screenshot.url}
                                                alt={`Screenshot ${index + 1}`}
                                                width={screenshot.dims[0]}
                                                height={screenshot.dims[1]}
                                                className="rounded-lg w-full"
                                            />
                                        ))
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getStatusName(status: number) {
    switch (status) {
        case 0: {
            return "Released"
        }
        case 1: {
            return "Under development"
        }
        case 2: {
            return "Cancelled"
        }
    }
}