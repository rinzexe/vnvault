'use client'

import { useEffect, useState } from "react"
import { useAuth } from "../_components/auth-provider"
import Image from "next/image"
import Avatar from "./avatar"
import { calculateLevel } from "@/utils/levels"
import { useRouter } from "next/navigation"

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<any>(null)

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchLeaderboard() {
            const res = await auth.getLeaderboard()
            setLeaderboardData(res)
        }

        fetchLeaderboard()
    }, [])

    return (
        <div className="flex flex-col w-full lg:w-auto items-center gap-8">
            <h1 className="mb-8">
                Leaderboard
            </h1>
            <div className="flex flex-col w-full lg:w-auto">
                <div className="grid w-full lg:w-auto items-center gap-12 grid-cols-2 lg:grid-cols-3 pb-4">
                    <p className="ml-10 text-sm text-neutral-500">
                        Name
                    </p>
                    <p className="hidden lg:block text-sm text-neutral-500">
                        Longest streak
                    </p>
                    <p className="flex text-left flex-row justify-end text-sm text-neutral-500">
                        Level
                    </p>
                </div>
                {leaderboardData && leaderboardData.map((user: any, index: number) => {
                    return (
                        <div onClick={() => router.push("/profile/" + user.username)} key={index} className="grid items-center gap-12 py-3 grid-cols-3 last:border-none border-b-[1px] hover:cursor-pointer border-b-neutral-700">
                            <div className="flex flex-row items-center gap-4 col-start-1 lg:col-end-2 col-end-3">
                                <p className="w-6">
                                    {index + 1 + "."}
                                </p>
                                <Avatar user={user} />
                                <h2>
                                    {user.username}
                                </h2>
                            </div>
                            <h4 className="hidden lg:block">
                                {user.longest_streak}
                            </h4>
                            <div className="flex flex-row justify-end">
                                <div className="">
                                    <h4>
                                        {"Level " + calculateLevel(user.xp).level}
                                    </h4>
                                    <p className="text-sm text-right text-blue-500">
                                        {user.xp + " XP"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}