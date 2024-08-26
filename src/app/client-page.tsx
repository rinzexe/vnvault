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
        <div className="max-w-[60rem] flex flex-col gap-4 items-center">
            <p className="text-center">
                ! This website is under development and might not work as intended, if you find any issues please report them so that I can fix them asap !
            </p>
            <div className="panel p-0 grid grid-cols-1 hover:border-neutral-700 duration-300 w-full grid-rows-1">
                <video src={"/challenge bg.webm"} loop muted autoPlay playsInline className=" brightness-[15%] w-full duration-300 col-start-1 col-end-1 row-start-1 row-end-1 rounded-xl h-full" />
                <div className="col-start-1 col-end-1 items-center  row-start-1 w-full row-end-1 z-10 flex p-8 flex-col justify-center pointer-events-none">
                    <h1>
                        VNVault
                    </h1>
                    <p>
                        Your go-to place for everything visual novels
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="my-4">
                    Recent recommendations
                </h1>
                <div className="grid grid-cols-4 gap-4 items-end">
                    <VNCard
                        title="Full Metal Daemon Muramasa"
                        alttitle="装甲悪鬼村正"
                        imageUrl="https://t.vndb.org/cv/25/77925.jpg"
                        href="/novel/v2016"
                    />
                    <VNCard
                        title="The House in Fata Morgana"
                        alttitle="ファタモルガーナの館"
                        imageUrl="https://t.vndb.org/cv/31/77731.jpg"
                        href="/novel/v12402"
                    />
                    <VNCard
                        title="Chaos;Child"
                        alttitle=""
                        imageUrl="https://t.vndb.org/cv/35/75835.jpg"
                        href="/novel/v14018"
                    />
                    <VNCard
                        title="Wonderful everyday"
                        alttitle="素晴らしき日々～不連続存在～"
                        imageUrl="https://t.vndb.org/cv/17/90017.jpg"
                        href="/novel/v3144"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="my-4">
                    Recent releases
                </h1>
                <div className="grid grid-cols-4 gap-4 items-end">
                    {recentReleaseData && recentReleaseData.map((data: any, id: number) => {
                        return (
                            <VNCard
                                key={id}
                                title={getEnglishTitle(data)}
                                alttitle={data.alttitle}
                                imageUrl={data.image && data.image.url}
                                href={"/novel/" + data.id}
                                fields={[
                                    <p key={id} className="text-neutral-500">
                                        {data.released}
                                    </p>
                                ]}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}