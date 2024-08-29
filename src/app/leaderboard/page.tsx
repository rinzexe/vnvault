'use client'

import { useEffect, useState } from "react"
import { useAuth } from "../_components/auth-provider"
import Image from "next/image"
import Avatar from "./avatar"
import { calculateLevel } from "@/utils/levels"
import { useRouter } from "next/navigation"
import Table from "../_components/table/table"
import Headers from "../_components/table/headers"
import Row from "../_components/table/table-entry"

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchLeaderboard() {
            const res = await auth.getLeaderboard()
            setLeaderboardData(res)
            setIsLoading(false)
        }

        fetchLeaderboard()
    }, [])

    return (
        <div className="flex flex-col w-full lg:w-auto items-center gap-8">
            <div className="max-w-[1000px] w-full">
                <h1 className="mb-8 text-center">
                    Leaderboard
                </h1>
                <Table
                    isLoading={isLoading}
                    acceptedTypes={{ row: true, card: false }}
                    headers={{
                        fields: ['Longest streak', 'Level']
                    }}
                    entries={
                        leaderboardData && leaderboardData.map((user: any, id: number) => {
                            return {
                                key: id,
                                href: "/profile/" + user.username,
                                avatarUser: user,
                                fields: [
                                    (
                                        <h4 key={id} className="hidden text-center lg:block">
                                            {user.longest_streak}
                                        </h4>
                                    ),
                                    (
                                        <div key={id} className="flex flex-row justify-end">
                                            <div className="">
                                                <h4>
                                                    {"Level " + calculateLevel(user.xp).level}
                                                </h4>
                                                <p className="text-sm text-right text-blue-500">
                                                    {user.xp + " XP"}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ],
                                title: user.username,
                            }

                        })
                    }
                />
            </div>
        </div >
    )
}