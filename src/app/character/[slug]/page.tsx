"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCharacterById } from "@/lib/vndb/search"
import { ICharacter, ICharacterVN } from "@/types/character"
import { IVN } from "@/types/vn"
import { parseCharacterRole } from "@/lib/vndb/utils"
import NSFWImage from "@/components/nsfw-image"
import Rating from "@/components/ui/rating"
import Description from "@/components/description"

export default function CharacterPage({ params }: { params: { slug: number } }) {
    const [loading, setLoading] = useState(true)
    const [characterData, setCharacterData] = useState<ICharacter | null>(null)
    const [displayedVNs, setDisplayedVNs] = useState(5)

    useEffect(() => {
        async function fetchData() {
            const characterRes: ICharacter = await getCharacterById(params.slug)
            setCharacterData(characterRes)
            setLoading(false)
        }

        fetchData()
    }, [params.slug])

    const loadMoreVNs = () => {
        setDisplayedVNs(prev => Math.min(prev + 5, characterData?.vns.length || 0))
    }

    return (
        <div className="min-h-screen py-4 space-y-8 w-full">
            <div className="container mx-auto rounded-lg md:p-8 p-2">
                <div className="flex md:flex-row flex-col md:gap-8 gap-4 justify-between items-start mb-8">
                    <div className="w-full md:w-1/3">
                        {loading ? (
                            <Skeleton className="w-full h-[450px]" />
                        ) : (
                            <NSFWImage
                                imageUrl={characterData?.image?.url!}
                                resolution={characterData?.image?.resolution!}
                                isNsfw={characterData?.image?.nsfw!}
                                className="w-full rounded-lg"
                                showAdvancedNsfwMessage
                            />
                        )}
                    </div>
                    <div className="w-full md:w-2/3 space-y-6">
                        {loading ? (
                            <Skeleton className="h-10 w-64" />
                        ) : (
                            <h1 className="text-4xl font-bold mb-2">{characterData?.name}</h1>
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
                                    <Description text={characterData?.description || "No description available."} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Appearances</CardTitle>
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
                                    {characterData?.vns.slice(0, displayedVNs).map((vn: ICharacterVN, index: number) => (
                                        <Link href={`/novel/${vn.id}`} key={index}>
                                            <Card className="transition-colors hover:bg-muted/50">
                                                <CardContent className="p-4 flex justify-between items-center space-x-4">
                                                    <img
                                                        src={vn.cover.url}
                                                        alt={vn.title}
                                                        width={60}
                                                        height={90}
                                                        className="rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">{vn.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{parseCharacterRole(vn.role)}</p>
                                                    </div>
                                                    <Rating rating={vn.rating!} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                                {displayedVNs < (characterData?.vns.length || 0) && (
                                    <Button
                                        onClick={loadMoreVNs}
                                        className="mt-4 w-full"
                                    >
                                        Load More Appearances
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