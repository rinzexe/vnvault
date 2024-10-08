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
import { IImage } from '@/types/image'
import { ICharacter } from "@/types/character"
import NSFWImage from "@/components/nsfw-image"
import VaultEdit from "@/components/vault-edit"
import { IVNVaultEntry } from "@/types/vault"
import { useAuth } from "@/components/auth-provider"
import { IVNTag } from "@/types/vn-tag"
import Link from "next/link"
import Description from "@/components/description"
import { parseCharacterRole } from "@/lib/vndb/utils"

interface IVNData extends IVN {
    characters: ICharacter[]
}

export default function VisualNovelInfoPage({ params }: { params: { slug: number } }) {
    const [loading, setLoading] = useState(true)
    const [vnData, setVnData] = useState<IVNData | null>(null)
    const [displayedCharacters, setDisplayedCharacters] = useState(10)
    const [displayedTags, setDisplayedTags] = useState(10)
    const [vaultEntry, setVaultEntry] = useState<IVNVaultEntry | null>(null)

    const auth = useAuth()

    useEffect(() => {
        async function fetchData() {
            const vnRes: IVN = await getVnById(params.slug)

            let characterRes: ICharacter[] = await getCharactersByVnId(params.slug)

            const userInfoRes = await auth.db.users.getUserInfoById(auth.user?.id!)
            const profileRes = await auth.db.users.getUserProfileByName(userInfoRes.username)

            const entry = profileRes.vault?.entries.find(obj => obj.vn.id == vnRes.id)

            if (entry) {
                setVaultEntry(entry)
            }

            setVnData({ characters: characterRes, ...vnRes })

            setLoading(false)
        }

        fetchData()
    }, [])

    const loadMoreCharacters = () => {
        setDisplayedCharacters(prev => Math.min(prev + 10, vnData?.characters.length || 0))
    }

    const loadMoreTags = () => {
        setDisplayedTags(prev => Math.min(prev + 20, vnData?.tags.length || 0))
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
                    {vaultEntry && <div className="flex items-center space-x-4">
                        <VaultEdit entryData={vaultEntry}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" /> Edit Vault
                            </Button>
                        </VaultEdit>
                    </div>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        {loading ? (
                            <Skeleton className="w-full h-[600px]" />
                        ) : (
                            <NSFWImage
                                imageUrl={vnData?.cover?.url!}
                                resolution={vnData?.cover?.resolution!}
                                isNsfw={vnData?.cover.nsfw!}
                                className="w-full rounded-lg"
                                showAdvancedNsfwMessage
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
                                        <p><strong>Status: </strong>{getStatusName(vnData?.devStatus || 0)}</p>
                                        <p><strong>Released: </strong>{vnData?.released || 'N/A'}</p>
                                        <p><strong>Length: </strong>{vnData?.length ? `${Math.round(vnData.length / 60)} hours` : 'N/A'}</p>
                                        <div className="flex items-center gap-2">
                                            <p><strong>Rating: </strong></p>
                                            <Badge>{vnData?.rating}</Badge>
                                            <p className="text-muted-foreground text-xs">
                                                <i>({vnData?.rateCount} votes)</i>
                                            </p>
                                        </div>
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
                                    <Description text={vnData?.description || "No description available."} />
                                )}
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="characters" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="characters" className="w-1/3">Characters</TabsTrigger>
                                <TabsTrigger value="screenshots" className="w-1/3">Screenshots</TabsTrigger>
                                <TabsTrigger value="details" className="w-1/3">Details</TabsTrigger>
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
                                            {vnData?.characters.slice(0, displayedCharacters).map((character, index: number) => (
                                                <Link key={index} href={"/character/" + character.id}>
                                                    <Card className="hover:bg-muted/50" key={character.id}>
                                                        <CardContent className="p-4 flex justify-center h-full items-center space-x-4">
                                                            <Image
                                                                src={character.image?.url || '/placeholder.svg'}
                                                                alt={character.name}
                                                                width={80}
                                                                height={120}
                                                                className="rounded-lg"
                                                            />
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">{character.name}</h3>
                                                                <p style={{ overflowWrap: "anywhere" }} className="text-sm line-clamp-2">{parseCharacterRole(character?.vns?.find((vn) => vn.id == params.slug)?.role || "")}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
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
                                        vnData?.screenshots.map((screenshot: IImage, index: number) => (
                                            <NSFWImage
                                                key={index}
                                                imageUrl={screenshot.url}
                                                resolution={screenshot.resolution}
                                                showAdvancedNsfwMessage
                                                isNsfw={screenshot.nsfw}
                                                className="rounded-lg w-full"
                                            />
                                        ))
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="details" className="mt-4">
                                {loading ? (
                                    <Skeleton className="h-40 w-full" />
                                ) : (
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Titles</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc pl-5">
                                                    {vnData?.titles.map((title, index) => (
                                                        <li key={index}>
                                                            {title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Developers</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc pl-5">
                                                    {vnData?.developers.map((dev, index) => (
                                                        <li key={index}>{dev.name}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Tags</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {vnData?.tags
                                                        .sort((a, b) => b.rating - a.rating)
                                                        .slice(0, displayedTags)
                                                        .map((tag, index) => (
                                                            <Badge key={index} variant={"secondary"}>
                                                                {tag.name} ({tag.rating.toFixed(1)})
                                                            </Badge>
                                                        ))}
                                                </div>
                                                {displayedTags < (vnData?.tags.length || 0) && (
                                                    <Button
                                                        onClick={loadMoreTags}
                                                        className="mt-4 w-full"
                                                    >
                                                        Load More Tags
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
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