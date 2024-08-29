'use client'

import AccentButton from "@/app/_components/accent-button"
import { useAuth } from "@/app/_components/auth-provider"
import RatingBadge from "@/app/_components/rating-badge"
import EditSVG from "@/app/_components/svgs/edit"
import Headers from "@/app/_components/table/headers"
import Row from "@/app/_components/table/table-entry"
import Table from "@/app/_components/table/table"
import VaultEditor from "@/app/_components/vault-editor"
import { vnSearchByIdList } from "@/lib/vndb/search"
import { getVaultStatusText } from "@/utils/vault"
import { getEnglishTitle } from "@/utils/vn-data"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { getVnLengthName } from "@/utils/vn-length"

export default function Vault({ params }: { params: { slug: string } }) {
    const [entries, setEntries] = useState<any>()
    const [isMe, setIsMe] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editingVid, setEditingVid] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [filters, setFilters] = useState<{ state: number, nsfw: number }>({ state: -1, nsfw: 0 })
    const [sorting, setSorting] = useState({ type: "rating", asc: false })

    const auth = useAuth()

    useEffect(() => {
        async function fetchVault() {
            var res: any
            filters.state > -1 ?
                res = await auth.getVault(params.slug, sorting.type != "title" ? sorting : { type: "rating", asc: false }, filters.state) :
                res = await auth.getVault(params.slug, sorting.type != "title" ? sorting : { type: "rating", asc: false })

            if (res.length > 0) {
                if (auth.user) {
                    const userData = await auth.getUserData(auth.user.id)

                    if (userData.username == params.slug) {
                        setIsMe(true)
                    }
                }

                var queries: any = []

                res.forEach((e: any) => {
                    queries.push(e.vid)
                });

                const vnData = await vnSearchByIdList(queries, sorting.type == "title" ? sorting : undefined)

                var filteredVnData: any = []
                var filteredResData: any = []

                if (filters.nsfw == 0) {
                    filteredVnData = vnData
                    filteredResData = res
                }
                else if (filters.nsfw == 1) {
                    vnData.forEach((data: any, id: number) => {
                        if (data.tags.find((tag: any) => tag.id == "g23")) {

                        }
                        else {
                            filteredResData.push(res.find((r:any) => r.vid == data.id))
                            filteredVnData.push(data)
                        }
                    });
                }
                else if (filters.nsfw == 2) {
                    vnData.forEach((data: any, id: number) => {
                        if (data.tags.find((tag: any) => tag.id == "g23")) {
                            filteredResData.push(res.find((r:any) => r.vid == data.id))
                            filteredVnData.push(data)
                        }
                        else {

                        }
                    });
                }

                var finalEntryDataArray: any = []

                if (sorting.type != "title") {
                    filteredResData.forEach((e: any, id: number) => {
                        const thisRes = filteredVnData.find((y: any) => e.vid == y.id)
                        console.log(e)
                        finalEntryDataArray.push({
                            ...e,
                            title: thisRes.title,
                            alttitle: thisRes.alttitle,
                            imageUrl: thisRes.image.url,
                            imageDims: thisRes.image.dims,
                            titles: thisRes.titles
                        })
                    });
                }
                else {
                    filteredVnData.forEach((e: any, id: number) => {
                        const thisRes = filteredResData.find((y: any) => y.vid == e.id)
                        finalEntryDataArray.push({
                            ...e,
                            imageUrl: e.image.url,
                            imageDims: e.image.dims,
                            created_at: thisRes.created_at,
                            updated_at: thisRes.updated_at,
                            rating: thisRes.rating,
                            status: thisRes.status
                        })
                    });
                }
            }

            setEntries(finalEntryDataArray)
            setIsLoading(false)
        }

        setEntries(undefined)
        setIsLoading(true)
        fetchVault()
    }, [isEditing, sorting, filters])

    function ratingSort() {
        setSorting({ type: "rating", asc: !sorting.asc })
    }

    function titleSort() {
        setSorting({ type: "title", asc: !sorting.asc })
    }

    function lastUpdateSort() {
        setSorting({ type: "updated_at", asc: !sorting.asc })
    }

    function statusSort() {
        setSorting({ type: "status", asc: !sorting.asc })
    }

    const modalContent: any = document.getElementById('modal-content');

    function toggleEditing(entry: any) {
        setEditingVid(entry.vid)
        setIsEditing(true)
    }

    function nsfwFilter(id: number) {
        setFilters({ ...filters, nsfw: id })
    }

    return (
        <div className="flex flex-col items-center w-full">
            {modalContent && isEditing && createPortal((
                <div className="fixed w-full h-full flex items-center justify-center bg-black/75 z-50">
                    <div onClick={() => { setIsEditing(false) }} className="fixed w-full h-full">
                    </div>
                    <VaultEditor isInVault={true} setIsEditing={setIsEditing} vid={editingVid} />
                </div>
            ), modalContent)}
            <div className="flex flex-col w-full items-center overflow-scoll gap-2 max-w-page">
                <div className="flex flex-col gap-8 lg:gap-0 lg:grid grid-cols-3 items-center w-full mb-8">
                    <Link className="w-fit self-start" href={"/profile/" + params.slug}>
                        <p className="text-sm text-neutral-500 w-fit hover:text-white duration-300">
                            {"<- Back to profile"}
                        </p>
                    </Link>
                    <h1 className="text-center">
                        {params.slug + "'s VNVault"}
                    </h1>
                </div>
                <Table
                    acceptedTypes={{ card: true, row: true }}
                    isLoading={isLoading}
                    headers={{
                        leftPadding: isMe ? 104 : 0,
                        sort: {
                            type:
                                sorting.type == "rating" ? 3 :
                                    sorting.type == "updated_at" ? 1 :
                                        sorting.type == "status" ? 2 :
                                            0,
                            asc: sorting.asc
                        },
                        fields: ['Updated', 'Status', 'Rating'],
                        sortingCallback: [titleSort, lastUpdateSort, statusSort, ratingSort]
                    }}
                    filters={{
                        filters: [
                            {
                                label: "State",
                                dropdownSettings: {
                                    labels: ['All', 'Finished', 'In progress', 'To-read', 'Dropped'],
                                    selected: filters.state + 1,
                                },
                                type: 'dropdown',
                                callback: (newValue: any) => setFilters({ ...filters, state: newValue - 1 })
                            },
                            {
                                label: "Content",
                                dropdownSettings: {
                                    labels: ['SFW & NSFW', 'SFW', 'NSFW'],
                                    selected: filters.nsfw
                                },
                                type: 'dropdown',
                                callback: nsfwFilter
                            },
                        ]
                    }}
                    entries={
                        entries && entries.map((entry: any, id: number) => {
                            return {
                                cardFields: {
                                    right: <RatingBadge className="mt-4" rating={entry.rating} />,
                                    left:
                                        (<div className="*:text-center">
                                            <p>
                                                {getVnLengthName(entry.length)}
                                            </p>
                                        </div>)
                                },
                                key: id,
                                href: "/novel/" + entry.vid,
                                fields: [
                                    <p key={id} className="">{entry.updated_at.split('T')[0]}</p>,
                                    <p key={id} className="">{getVaultStatusText(entry.status)}</p>,
                                    entry.rating ? <RatingBadge rating={entry.rating} /> : <p className="text-right ">Unrated</p>
                                ],
                                iconUrl: entry.imageUrl,
                                dims: entry.imageDims,
                                hasIcon: true,
                                title: getEnglishTitle(entry),
                                subtitle: entry.alttitle,
                                actionContent: isMe && (
                                    <div onClick={() => toggleEditing(entry)} className="group w-fit hidden lg:flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10">
                                        <h4 className="duration-300 group-hover:text-blue-500 group-hover:font-bold">
                                            Edit
                                        </h4>
                                        <EditSVG className="w-8 h-8 pl-2 stroke-white  stroke-2 group-hover:stroke-[3px]  group-hover:stroke-blue-500 duration-300" />
                                    </div>
                                )
                            }
                        })
                    }
                />
            </div >
        </div >
    )
}