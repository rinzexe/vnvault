"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Star, Clock, BarChart2, Edit, Save, X, Search } from "lucide-react"
import { useAuth } from '@/components/auth-provider'
import { IRecentActivityEntry, IUserProfile } from '@/types/user-profile'
import FavoriteEditModal from "./favorite-edit-modal"
import Link from "next/link"
import useIsMe from "@/hooks/use-is-me"

export default function ProfilePage({ params }: { params: { slug: string } }) {
    const [loading, setLoading] = useState<boolean>(true)
    const [editing, setEditing] = useState<any>({ bio: false })
    const [userData, setUserData] = useState<IUserProfile | null>(null)
    const [_, rerender] = useState<boolean>(false)

    const auth = useAuth()
    const isMe = useIsMe(params.slug)

    useEffect(() => {
        async function fetchData() {
            const userProfileData = await auth.db.users.getUserProfileByName(params.slug)
            setUserData(userProfileData)
            setLoading(false)
        }
        fetchData()
    }, [auth, params.slug, _])

    const handleEdit = (section: any) => setEditing((prev: any) => ({ ...prev, [section]: true }))
    const handleSave = (section: any) => {
        auth.db.users.updateUser(auth?.user?.id!, { bio: userData?.bio })
        setEditing((prev: any) => ({ ...prev, [section]: false }))
    }
    const handleCancel = (section: any) => setEditing((prev: any) => ({ ...prev, [section]: false }))

    return (
        <div className="max-w-screen-xl mx-auto bg-background flex flex-col gap-4 py-4">
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {loading ? (
                                <Skeleton className="w-[100px] h-[100px] rounded-full" />
                            ) : (
                                <img
                                    src={userData?.avatarUrl}
                                    alt={userData?.username}
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                {loading ? (
                                    <Skeleton className="h-8 w-32 mb-2" />
                                ) : (
                                    <h1 className="text-2xl font-bold">{userData?.username}</h1>
                                )}
                                {loading ? (
                                    <Skeleton className="h-4 w-24" />
                                ) : (
                                    <p className="text-sm text-muted-foreground">Joined {userData?.joinedOn}</p>
                                )}
                            </div>
                        </div>
                        <Link href={"/profile/" + params.slug + "/vault"}>
                            <Button size="sm">Go to Vault</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold">Bio</CardTitle>
                            {isMe && !loading && (
                                editing.bio ? (
                                    <div>
                                        <Button variant="ghost" size="sm" onClick={() => handleSave('bio')}><Save className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleCancel('bio')}><X className="w-4 h-4" /></Button>
                                    </div>
                                ) : (
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit('bio')}><Edit className="w-4 h-4" /></Button>
                                )
                            )}
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-20 w-full" />
                            ) : (
                                editing.bio ? (
                                    <Textarea
                                        value={userData?.bio}
                                        onChange={(e) => setUserData((prev: any) => ({ ...prev, bio: e.target.value }))}
                                        className="w-full"
                                    />
                                ) : (
                                    <p className="text-sm">{userData?.bio}</p>
                                )
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Favorites</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center pb-2">
                                <Label className="text-sm font-medium mb-2 block">Visual Novels</Label>
                                {isMe && userData && <FavoriteEditModal type={"vn"} username={userData.username} />}
                            </div>
                            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                                <div className="flex space-x-4 p-4">
                                    {loading ? (
                                        Array(4).fill(0).map((_, index) => (
                                            <Skeleton key={index} className="w-24 h-36 flex-shrink-0" />
                                        ))
                                    ) : (
                                        userData?.favoriteVisualNovels.map((vn: any, index: any) => (
                                            <div key={index} className="w-24 flex-shrink-0">
                                                <Image
                                                    src={vn.cover.url}
                                                    alt={vn.title}
                                                    width={96}
                                                    height={144}
                                                    className="rounded-md object-cover"
                                                />
                                                <p className="text-xs mt-1 text-center truncate">{vn.title}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center pb-2">
                                <Label className="text-sm font-medium mb-2 block">Characters</Label>
                                {isMe && userData && <FavoriteEditModal type={"character"} username={userData.username} />}
                            </div>
                            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                                <div className="flex space-x-4 p-4">
                                    {loading ? (
                                        Array(4).fill(0).map((_, index) => (
                                            <Skeleton key={index} className="w-24 h-36 flex-shrink-0" />
                                        ))
                                    ) : (
                                        userData?.favoriteCharacters.map((character: any, index: any) => (
                                            <div key={index} className="w-24 flex-shrink-0">
                                                <Image
                                                    src={character.image.url}
                                                    alt={character.name}
                                                    width={96}
                                                    height={144}
                                                    className="rounded-md object-cover"
                                                />
                                                <p className="text-xs mt-1 text-center truncate">{character.name}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {loading ? (
                                    Array(4).fill(0).map((_, index) => (
                                        <Skeleton key={index} className="h-20 w-full" />
                                    ))
                                ) : (
                                    <>
                                        <div className="flex flex-col items-center">
                                            <BookOpen className="w-8 h-8 mb-2 text-primary" />
                                            <div className="text-2xl font-bold">{userData?.stats.totalVnsInList}</div>
                                            <div className="text-xs text-muted-foreground">Total VNs</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Star className="w-8 h-8 mb-2 text-primary" />
                                            <div className="text-2xl font-bold">{userData?.stats.averageRating?.toFixed(1) || 'N/A'}</div>
                                            <div className="text-xs text-muted-foreground">Avg Rating</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Clock className="w-8 h-8 mb-2 text-primary" />
                                            <div className="text-2xl font-bold">{((userData?.stats?.totalMinutesRead ?? 0) / 60).toFixed(1)}</div>
                                            <div className="text-xs text-muted-foreground">Total hours read</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <BarChart2 className="w-8 h-8 mb-2 text-primary" />
                                            <div className="text-2xl font-bold">{userData?.stats.ratedVns}</div>
                                            <div className="text-xs text-muted-foreground">Rated</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                <ul className="space-y-4">
                                    {loading ? (
                                        Array(5).fill(0).map((_, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <Skeleton className="w-4 h-4 mt-0.5" />
                                                <div className="flex-1 space-y-1">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        userData?.stats.recentActivity.map((activity: IRecentActivityEntry, index: number) => (
                                            <li key={index} className="flex gap-2 items-center">
                                                <img className='rounded-lg h-fit w-1/6' src={activity.vn.cover.url} />
                                                <div className="flex-1 space-y-1">
                                                    <p className='text-sm font-medium'>
                                                        {activity.vn.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                                                </div>
                                                <div className='ml-2 flex items-center gap-4'>
                                                    <p className="text-sm font-medium leading-none">
                                                        {activity.rating && (
                                                            <div className="flex items-center justify-end">
                                                                <span className="text-lg font-bold text-accent">{activity.rating}</span>
                                                                <span className="text-sm text-muted-foreground ml-1">/10</span>
                                                            </div>
                                                        )}
                                                    </p>
                                                    <p className='text-sm'>
                                                        {activity.status}
                                                    </p>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/*  <Tabs defaultValue="stats" className="p-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="genres">Genres</TabsTrigger>
                    <TabsTrigger value="ratings">Ratings</TabsTrigger>
                </TabsList>
                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reading Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-40 w-full" />
                            ) : (
                                <>piechart</>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="genres">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Genres</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-40 w-full" />
                            ) : (
                                <>piechart</>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ratings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-40 w-full" />
                            ) : (
                                <>piechart</>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs> */}
        </div>
    )
}