'use client'

import { useEffect, useState } from "react"
import { useAuth } from "./_components/auth-provider"
import { getRecentVnReleases, vnSearchByIdList } from "@/lib/vndb/search"
import Link from "next/link"
import { getEnglishTitle } from "@/utils/vn-data"
import VNCard from "./_components/vn-card"
import { timeSince } from "@/utils/time"

export default function ClientPage() {

    const [recentReleaseData, setRecentReleaseData] = useState<any>()

    useEffect(() => {
        async function fetchRecentReleases() {
            const res = await getRecentVnReleases()

            setRecentReleaseData(res.slice(0, 4))
        }

        fetchRecentReleases()
    }, [])

    return (
        <div className="max-w-page flex flex-col gap-4 items-center">
            <div className=" p-0 grid grid-cols-1 h-[80vh] hover:border-neutral-700 duration-300 w-full grid-rows-1">
                <div className="col-start-1 col-end-1 items-center  row-start-1 w-full row-end-1 z-10 flex p-8 flex-col justify-center pointer-events-none">
                    <h1>
                        VNVault
                    </h1>
                    <p>
                        Your go-to place for everything visual novels
                    </p>
                </div>
            </div>
        </div>
    )
}