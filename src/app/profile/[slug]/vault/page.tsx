'use client'

import AccentButton from "@/app/_components/accent-button"
import { useAuth } from "@/app/_components/auth-provider"
import RatingBadge from "@/app/_components/rating-badge"
import EditSVG from "@/app/_components/svgs/edit"
import Headers from "@/app/_components/table/headers"
import Row from "@/app/_components/table/row"
import Table from "@/app/_components/table/table"
import VaultEditor from "@/app/_components/vault-editor"
import { getVaultStatusText } from "@/utils/vault"
import { vnListSearchById } from "@/utils/vndb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function Vault({ params }: { params: { slug: string } }) {
    const [entries, setEntries] = useState<any>()
    const [isMe, setIsMe] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editingVid, setEditingVid] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState<"all" | "finished" | "in progress" | "not read" | "dropped">("all")
    const [sorting, setSorting] = useState({ type: "rating", asc: false })

    const auth = useAuth()

    useEffect(() => {
        async function fetchVault() {
            const res = await auth.getVault(params.slug, sorting.type != "title" ? sorting : { type: "rating", asc: false })
            const userData = await auth.getUserData(auth.user.id)

            if (userData.username == params.slug) {
                setIsMe(true)
            }

            var queries: any = []

            res.forEach((e: any) => {
                queries.push(e.vid)
            });

            const vnDataRes = await vnListSearchById(queries, 100, sorting.type == "title" ? sorting : undefined)

            var vnData: any = vnDataRes.results
            var iterationCount = 1
            while (iterationCount * 100 < vnDataRes.count) {
                const vnDataRes2 = await vnListSearchById(queries, 100, sorting.type == "title" ? sorting : undefined)
                vnData = [...vnData, ...vnDataRes2.results]
                iterationCount++
            }

            var finalEntryDataArray: any = []


            if (sorting.type != "title") {
                res.forEach((e: any, id: number) => {
                    const thisRes = vnData.find((y: any) => e.vid == y.id)
                    finalEntryDataArray.push({
                        ...e,
                        title: thisRes.title,
                        alttitle: thisRes.alttitle,
                        imageUrl: thisRes.image.url
                    })
                });
            }
            else {
                vnData.forEach((e: any, id: number) => {
                    const thisRes = res.find((y: any) => y.vid == e.id)
                    finalEntryDataArray.push({
                        ...e,
                        imageUrl: e.image.url,
                        created_at: thisRes.created_at,
                        updated_at: thisRes.updated_at,
                        rating: thisRes.rating,
                        status: thisRes.status
                    })
                });
            }

            setEntries(finalEntryDataArray)
            setIsLoading(false)
        }

        setEntries({})
        setIsLoading(true)
        fetchVault()
    }, [isEditing, sorting])

    function ratingSort() {
        setSorting({ type: "rating", asc: !sorting.asc })
    }

    function titleSort() {
        setSorting({ type: "title", asc: !sorting.asc })
    }

    function addedSort() {
        setSorting({ type: "created_at", asc: !sorting.asc })
    }

    function lastUpdateSort() {
        setSorting({ type: "updated_at", asc: !sorting.asc })
    }

    function statusSort() {
        setSorting({ type: "status", asc: !sorting.asc })
    }

    const modalContent: any = document.getElementById('modal-content');

    return (
        <div className="flex flex-col items-center w-full">
            {modalContent && isEditing && createPortal((
                <div className="fixed w-full h-full flex items-center justify-center bg-black/75 z-50">
                    <div onClick={() => { setIsEditing(false) }} className="fixed w-full h-full">
                    </div>
                    <VaultEditor isInVault={true} setIsEditing={setIsEditing} vid={editingVid} />
                </div>
            ), modalContent)}
            <div className="flex flex-col items-center overflow-scoll max-w-[90vw] gap-2 w-[60rem]">
                <div className="grid grid-cols-3 items-center w-full">
                    <Link href={"/profile/" + params.slug}>
                        <p className="text-sm text-neutral-500 hover:text-white duration-300">
                            {"<- Back to profile"}
                        </p>
                    </Link>
                    <h1 className="text-center">
                        {params.slug + "'s VNVault"}
                    </h1>
                </div>
                {entries && entries.length > 0 ? (
                    <Table>
                        <Headers
                            sort={{
                                type:
                                    sorting.type == "rating" ? 4 :
                                        sorting.type == "created_at" ? 1 :
                                            sorting.type == "updated_at" ? 2 :
                                                sorting.type == "status" && 3
                                , asc: sorting.asc
                            }}
                            isEditable={isMe}
                            fields={['Added', 'Last update', 'Status', 'Rating']}
                            sortingCallback={[titleSort, addedSort, lastUpdateSort, statusSort, ratingSort]}
                        />
                        {entries.map((entry: any, index: number) => {
                            return (
                                <Entry key={index} entry={entry} isMe={isMe} setIsEditing={setIsEditing} setEditingVid={setEditingVid} />
                            )
                        })}
                    </Table>
                ) : (
                    isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            <p>No vns in vault :(</p>
                        </div>
                    )
                )
                }
            </div >
        </div >
    )
}

function Entry({ entry, isMe, setIsEditing, setEditingVid }: any) {
    function toggleEditing() {
        setEditingVid(entry.vid)
        setIsEditing(true)
    }

    return (
        <div>
            {entry && <Row
                href={"/novel/" + entry.vid}
                iconUrl={entry && entry.imageUrl}
                fields={[
                    entry.created_at.split('T')[0],
                    entry.updated_at.split('T')[0],
                    getVaultStatusText(entry.status),
                    entry.rating ? <RatingBadge rating={entry.rating} /> : <p className="text-right ">Unrated</p>
                ]}
                title={entry.title}
                subtitle={entry.alttitle}
                editingCallback={isMe && toggleEditing}
            />}
        </div>
    )
}
