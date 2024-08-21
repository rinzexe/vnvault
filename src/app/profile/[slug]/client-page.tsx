'use client'

import { useEffect, useState } from "react";
import ProfilePanel from "../_components/profile-panel";
import { useAuth } from "@/app/_components/auth-provider";
import { useRouter } from "next/navigation";
import { vnListSearchById } from "@/utils/vndb";
import { genreTags } from "@/consts/tags";
import getStatusName from "@/consts/status";

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
    ratedVns: number
    vaultStats: any
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

            var queries: any = []

            vaultEntries && vaultEntries.forEach((e: any) => {
                queries.push(e.vid)
            });

            var vnData: any = []

            if (queries.length > 0) {
                vnData = await vnListSearchById(queries, { type: "title", asc: false })
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

            var recentUpdateData = vnData.filter((vn: any) => vn.id == vaultEntries[0].vid || vn.id == vaultEntries[1].vid || vn.id == vaultEntries[2].vid)

            recentUpdateData.forEach((entry: any, id: number) => {
                recentUpdateData[id] = { ...entry, status: vaultEntries[id].status, updatedAt: vaultEntries[id].updated_at }
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

                ratedEntryStats[10 - entry.rating].value += 1
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

            setStats({
                totalVnsRead: readVaultEntries.length,
                totalVnsInProgress: inProgressVaultEntries.length,
                totalVnsToRead: toReadVaultEntries.length,
                totalVnsDropped: droppedVaultEntries.length,
                totalVnsInList: vaultEntries.length,
                totalMinutesRead: totalMinutes,
                recentUpdates: recentUpdateData,
                genreStats: favoriteTags,
                vaultStats: vaultStats,
                ratingStats: ratedEntryStats,
                averageRating: averageRating,
                ratedVns: ratedEntries.length
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