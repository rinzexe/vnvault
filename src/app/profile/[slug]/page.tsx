'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from '@/components/auth-provider'
import useIsMe from "@/hooks/use-is-me"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Star, Clock, BarChart2, Edit, Save, X, Search, Activity, FileText, BookMarked } from "lucide-react"
import NSFWImage from "@/components/nsfw-image"
import EditableAvatar from "@/components/editable-avatar"
import Rating from '@/components/ui/rating'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Pie, Cell, PieChart } from 'recharts'
import Banner from "@/components/editable-banner"
import { IVNVaultEntry } from "@/types/vault"
import { IUser, IUserStats } from "@/types/user"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

export default function Component({ params }: { params: { slug: string } }) {
    const [loading, setLoading] = useState<boolean>(true)
    const [editing, setEditing] = useState<any>({ bio: false })
    const [userData, setUserData] = useState<IUser | null>(null)
    const [recentActivity, setRecentActivity] = useState<IVNVaultEntry[] | null>(null)
    const [userStats, setUserStats] = useState<IUserStats | null>(null)

    const auth = useAuth()
    const isMe = useIsMe(params.slug)

    useEffect(() => {
        async function fetchData() {
            const userProfileData = await auth.db.users.getUserByName(params.slug)
            setRecentActivity(await auth.db.vaults.getRecentVaultEntriesByName(params.slug))
            setUserStats(await auth.db.users.calculateStats(await auth.db.vaults.getVaultByName(params.slug)))
            setUserData(userProfileData)
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className="max-w-screen-xl mx-auto bg-background flex flex-col gap-6 py-8">
            <Card className="overflow-hidden">
                {loading ? <Skeleton className="w-full h-48" /> : <Banner currentImageUrl={userData?.bannerUrl || ""} />}
                <CardContent className="relative pointer-events-none pt-0">
                    <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 gap-4">
                        <div className="z-10 pointer-events-auto">
                            {loading ? (
                                <Skeleton className="w-32 h-32 rounded-full" />
                            ) : (
                                <EditableAvatar
                                    currentImageUrl={userData?.avatarUrl || ""}
                                />
                            )}
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            {loading ? (
                                <Skeleton className="h-8 w-32 mb-2" />
                            ) : (
                                <h1 className="text-3xl font-bold">{userData?.username}</h1>
                            )}
                            {loading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                <p className="text-sm text-muted-foreground">Joined {userData?.joinedOn}</p>
                            )}
                        </div>
                        <div className="flex gap-2 pointer-events-auto">
                            <Link href={`/profile/${params.slug}/vault`}>
                                <Button>Go to Vault</Button>
                            </Link>
                            {isMe && (
                                <Link href={"/settings"}>
                                    <Button variant="outline">Edit Profile</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="guides">Guides</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Edit className="w-5 h-5" />
                                        Bio
                                    </CardTitle>
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
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Quick Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        {loading ? (
                                            Array(4).fill(0).map((_, index) => (
                                                <Skeleton key={index} className="h-20 w-full" />
                                            ))
                                        ) : userStats && (
                                            <>
                                                <StatItem
                                                    icon={<BookOpen className="w-8 h-8 text-primary" />}
                                                    value={userStats.totalVnsInList}
                                                    label="Total VNs"
                                                />
                                                <StatItem
                                                    icon={<Star className="w-8 h-8 text-primary" />}
                                                    value={userStats.averageRating?.toFixed(1) || 'N/A'}
                                                    label="Avg given rating"
                                                />
                                                <StatItem
                                                    icon={<Clock className="w-8 h-8 text-primary" />}
                                                    value={((userStats.totalMinutesRead ?? 0) / 60).toFixed(1)}
                                                    label="Total hours read"
                                                />
                                                <StatItem
                                                    icon={<BarChart2 className="w-8 h-8 text-primary" />}
                                                    value={userStats.ratedVns}
                                                    label="Rated"
                                                />
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Vault info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <Skeleton className="h-[350px] w-full mb-4" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={[
                                                { name: 'Dropped', value: userStats?.totalVnsDropped },
                                                { name: 'Finished', value: userStats?.totalVnsFinished },
                                                { name: 'Reading', value: userStats?.totalVnsReading },
                                                { name: 'To Read', value: userStats?.totalVnsToRead }
                                            ]}>
                                                <XAxis
                                                    dataKey="name"
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Bar dataKey="value" className="fill-foreground" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                    <Table className="hover:bg-transparent">
                                        <TableBody>
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell className="p-2 align-top">
                                                    <Table className="hover:bg-transparent">
                                                        <TableBody>
                                                            {[
                                                                { label: "Dropped", value: userStats?.totalVnsDropped },
                                                                { label: "Finished", value: userStats?.totalVnsFinished },
                                                                { label: "Reading", value: userStats?.totalVnsReading },
                                                                { label: "To Read", value: userStats?.totalVnsToRead },
                                                            ].map((stat, index) => (
                                                                <TableRow className="hover:bg-transparent" key={index}>
                                                                    <TableCell className="py-1 pl-0 pr-2">{stat.label}</TableCell>
                                                                    <TableCell className="py-1 pl-2 pr-0 font-bold text-right">
                                                                        {loading ? <Skeleton className="h-4 w-8" /> : stat.value}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                                <TableCell className="p-2 align-top">
                                                <Table className="hover:bg-transparent">
                                                        <TableBody>
                                                            {[
                                                                { label: "Total", value: userStats?.totalVnsInList },
                                                                { label: "Average rating", value: userStats?.averageRatingPlayed?.toFixed(2) },
                                                                { label: "Average votecount", value: userStats?.averageVotecount?.toFixed(0) },
                                                            ].map((stat, index) => (
                                                                <TableRow className="hover:bg-transparent" key={index}>
                                                                    <TableCell className="py-1 pl-0 pr-2">{stat.label}</TableCell>
                                                                    <TableCell className="py-1 pl-2 pr-0 font-bold text-right">
                                                                        {loading ? <Skeleton className="h-4 w-8" /> : stat.value}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Star className="w-5 h-5" />
                                        Favorites
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="vn">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="vn">Visual Novels</TabsTrigger>
                                            <TabsTrigger value="characters">Characters</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="vn" className="mt-4">
                                            <div className="flex justify-between items-center pb-2">
                                                <Label className="text-sm font-medium">Visual Novels</Label>
                                            </div>
                                            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                                                <div className="flex space-x-4 p-4">
                                                    {loading ? (
                                                        Array(4).fill(0).map((_, index) => (
                                                            <Skeleton key={index} className="w-32 h-48 flex-shrink-0" />
                                                        ))
                                                    ) : (
                                                        userData?.favoriteVisualNovels?.map((vn: any, index: any) => (
                                                            <div key={index} className="w-32 flex-shrink-0">
                                                                <Image
                                                                    src={vn.cover.url}
                                                                    alt={vn.title}
                                                                    width={128}
                                                                    height={192}
                                                                    className="rounded-md object-cover"
                                                                />
                                                                <p className="text-xs mt-1 text-center truncate">{vn.title}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        </TabsContent>
                                        <TabsContent value="characters" className="mt-4">
                                            <div className="flex justify-between items-center pb-2">
                                                <Label className="text-sm font-medium">Characters</Label>
                                            </div>
                                            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                                                <div className="flex space-x-4 p-4">
                                                    {loading ? (
                                                        Array(4).fill(0).map((_, index) => (
                                                            <Skeleton key={index} className="w-32 h-48 flex-shrink-0" />
                                                        ))
                                                    ) : (
                                                        
                                                        userData?.favoriteCharacters?.map((character: any, index: any) => (
                                                            <div key={index} className="w-32 flex-shrink-0">
                                                                <Image
                                                                    src={character.image.url}
                                                                    alt={character.name}
                                                                    width={128}
                                                                    height={192}
                                                                    className="rounded-md object-cover"
                                                                />
                                                                <p className="text-xs mt-1 text-center truncate">{character.name}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px] w-full">
                                        <ul className="space-y-4">
                                            {loading ? (
                                                Array(5).fill(0).map((_, index) => (
                                                    <li key={index} className="flex items-start space-x-2">
                                                        <Skeleton className="w-12 h-16" />
                                                        <div className="flex-1 space-y-1">
                                                            <Skeleton className="h-4 w-full" />
                                                            <Skeleton className="h-3 w-24" />
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                recentActivity && recentActivity.map((activity: IVNVaultEntry, index: number) => (
                                                    <Card key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4">
                                                        <NSFWImage
                                                            className="w-16 h-24 object-cover rounded"
                                                            imageUrl={activity.vn.cover.url}
                                                            isNsfw={activity.vn.cover.nsfw}
                                                            resolution={activity.vn.cover.resolution}
                                                        />
                                                        <div className="flex-1 space-y-1">
                                                            <p className='text-sm font-medium'>{activity.vn.title}</p>
                                                            <p className="text-xs text-muted-foreground">{activity.updatedAt}</p>
                                                        </div>
                                                        <div className='mt-2 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end gap-2'>
                                                            {activity.rating != 0 && (
                                                                <Rating rating={activity.rating} />
                                                            )}
                                                            <p className='text-xs font-medium bg-secondary/50 px-2 py-1 rounded'>
                                                                {activity.status}
                                                            </p>
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </ul>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="reviews">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Reviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Coming soon...
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="guides">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <BookMarked className="w-5 h-5" />
                                Guides
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Coming soon...
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode, value: React.ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center">
            {icon}
            <div className="text-2xl font-bold mt-2">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    )
}