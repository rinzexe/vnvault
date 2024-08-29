'use client'

import { useEffect, useState } from "react";
import ProfilePanel from "../_components/profile-panel";
import { useAuth } from "@/app/_components/auth-provider";
import { useRouter } from "next/navigation";
import { genreTags } from "@/consts/tags";
import getStatusName from "@/consts/status";
import { vnSearchByIdList } from "@/lib/vndb/search";

export interface GenreStats {
    name: string
    value: string
}

export interface Stats {
    totalVnsRead: number
    totalVnsInProgress: number
    totalVnsToRead: number
    totalVnsDropped: number
    totalVnsInList: number
    totalMinutesRead: number
    recentUpdates: any[]
    genreStats: GenreStats[]
    ratingStats: any
    averageRating: number
    recentRates: any
    ratedVns: number
    vaultStats: any
    averageVotecount: number
    averageRatingPlayed: number
}

export default function ClientProfile({ params }: { params: { slug: string } }) {
    const [userData, setProfile] = useState<any>(null)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [stats, setStats] = useState<Stats>()

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchProfile() {
            const fetchedUserData = await auth.getUserDataWithUsername(params.slug)


            const res = await auth.supabase.from('vault_entries').select('*').eq('owner_id', fetchedUserData.id).order('updated_at', { ascending: false })
            const vaultEntries = res.data

            const readVaultEntries = vaultEntries.filter((entry: any) => entry.status == 0)
            const inProgressVaultEntries = vaultEntries.filter((entry: any) => entry.status == 1)
            const toReadVaultEntries = vaultEntries.filter((entry: any) => entry.status == 2)
            const droppedVaultEntries = vaultEntries.filter((entry: any) => entry.status == 3)
            const ratedVaultEntries = vaultEntries.filter((entry: any) => entry.rating != 0)
            const readAndDroppedEntries = [...readVaultEntries, ...droppedVaultEntries]

            var queries: any = []

            vaultEntries && vaultEntries.forEach((e: any) => {
                queries.push(e.vid)
            });

            var vnData: any = []

            if (queries.length > 0) {
                vnData = await vnSearchByIdList(queries, { type: "title", asc: false })
            }
            var readVnData: any = []
            readVaultEntries.forEach((entry: any) => {
                const tempVnData = vnData.filter((vn: any) => vn.id == entry.vid)
                readVnData.push(tempVnData[0])
            });

            var totalMinutes = 0

            readVnData.forEach((vn: any) => {
                totalMinutes += vn.length_minutes
            });

            var recentUpdateData = vnData.filter((vn: any) => vn.id == vaultEntries[0].vid || vn.id == vaultEntries[1].vid || vn.id == vaultEntries[2].vid).sort((a: any, b: any) => {
                if (a.id == vaultEntries[0].vid) {
                    return -1
                }
                if (a.id == vaultEntries[1].vid && b.id == vaultEntries[2].vid) {
                    return -1
                }
            })

            recentUpdateData.forEach((entry: any, id: number) => {
                recentUpdateData[id] = { ...entry, status: vaultEntries[id].status, updatedAt: vaultEntries[id].updated_at }
            });



            var recentRatedData = vnData.filter((vn: any) => vn.id == ratedVaultEntries[0].vid || vn.id == ratedVaultEntries[1].vid || vn.id == ratedVaultEntries[2].vid).sort((a: any, b: any) => {
                if (a.id == ratedVaultEntries[0].vid) {
                    return -1
                }
                if (a.id == ratedVaultEntries[1].vid && b.id == ratedVaultEntries[2].vid) {
                    return -1
                }
            })

            recentRatedData.forEach((entry: any, id: number) => {
                recentRatedData[id] = { ...entry, rating: ratedVaultEntries.find((rentry: any) => rentry.vid == entry.id).rating, status: ratedVaultEntries[id].status, updatedAt: ratedVaultEntries[id].updated_at }
            });

            var favoriteTags: any = {}

            readVnData.forEach((vn: any) => {
                vn.tags.forEach((tag: any) => {
                    if (tag.category == 'cont') {
                        if (genreTags.some((tagName: string) => tagName == tag.name)) {
                            if (favoriteTags[tag.name] == undefined) {
                                favoriteTags[tag.name] = 0
                            }
                            favoriteTags[tag.name] += Math.round(vn.length_minutes / 6) / 10
                        }
                    }
                })
            });

            favoriteTags = Object.keys(favoriteTags).map((key: any) => { return { name: key, value: favoriteTags[key] } })

            favoriteTags.sort((a: any, b: any) => {
                return a.minutesRead - b.minutesRead;
            });

            if (favoriteTags.length > 10) {
                favoriteTags.slice(0, 10)
            }

            const ratedEntries = vaultEntries.filter((entry: any) => entry.rating != 0)

            var ratedEntryStats: any = [
                {
                    name: '10',
                    value: 0,
                },
                {
                    name: '9',
                    value: 0,
                },
                {
                    name: '8',
                    value: 0,
                },
                {
                    name: '7',
                    value: 0,
                },
                {
                    name: '6',
                    value: 0,
                },
                {
                    name: '5',
                    value: 0,
                },
                {
                    name: '4',
                    value: 0,
                },
                {
                    name: '3',
                    value: 0,
                },
                {
                    name: '2',
                    value: 0,
                },
                {
                    name: '1',
                    value: 0,
                },
            ];

            ratedEntries.forEach((entry: any, id: number) => {
                if (entry.rating != null) {
                    ratedEntryStats[10 - entry.rating].value += 1
                }
            })

            const vaultStats: any = [];

            readVaultEntries.length > 0 && vaultStats.push({ name: getStatusName(0), value: readVaultEntries.length })
            inProgressVaultEntries.length > 0 && vaultStats.push({ name: getStatusName(1), value: inProgressVaultEntries.length })
            toReadVaultEntries.length > 0 && vaultStats.push({ name: getStatusName(2), value: toReadVaultEntries.length })
            droppedVaultEntries.length > 0 && vaultStats.push({ name: getStatusName(3), value: droppedVaultEntries.length })

            var total = 0;
            for (var i = 0; i < ratedEntries.length; i++) {
                total += ratedEntries[i].rating;
            }
            var averageRating = total / ratedEntries.length;

            var averageVotecount = 0

            readAndDroppedEntries.forEach((entry: any, id: number) => {
                averageVotecount += vnData.find((data: any) => data.id == entry.vid).votecount
            })

            averageVotecount /= readAndDroppedEntries.length
            averageVotecount = Math.round(averageVotecount)

            var averageRatingPlayed = 0

            readAndDroppedEntries.forEach((entry: any, id: number) => {
                averageRatingPlayed += vnData.find((data: any) => data.id == entry.vid).rating
            })

            averageRatingPlayed /= readAndDroppedEntries.length
            averageRatingPlayed = Math.round(averageRatingPlayed)

            setStats({
                totalVnsRead: readVaultEntries.length,
                totalVnsInProgress: inProgressVaultEntries.length,
                totalVnsToRead: toReadVaultEntries.length,
                totalVnsDropped: droppedVaultEntries.length,
                totalVnsInList: vaultEntries.length,
                totalMinutesRead: totalMinutes,
                recentUpdates: recentUpdateData,
                recentRates: recentRatedData,
                genreStats: favoriteTags,
                vaultStats: vaultStats,
                ratingStats: ratedEntryStats,
                averageRating: averageRating,
                ratedVns: ratedEntries.length,
                averageVotecount: averageVotecount,
                averageRatingPlayed: averageRatingPlayed
            })

            setLoaded(true)
            setProfile(fetchedUserData)
        }

        fetchProfile()
    }, [auth])

    return (
        <div>
            {userData && <ProfilePanel slug={params.slug} userData={userData} auth={auth} stats={stats} />}
        </div>
    )
}