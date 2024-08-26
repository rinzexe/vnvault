'use client'

import AccentButton from "@/app/_components/accent-button"
import { useAuth } from "@/app/_components/auth-provider"
import RatingBadge from "@/app/_components/rating-badge"
import EditSVG from "@/app/_components/svgs/edit"
import Headers from "@/app/_components/table/headers"
import Row from "@/app/_components/table/row"
import Table from "@/app/_components/table/table"
import VaultEditor from "@/app/_components/vault-editor"
import { vnSearchByIdList } from "@/lib/vndb/search"
import { getVaultStatusText } from "@/utils/vault"
import { getEnglishTitle } from "@/utils/vn-data"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function Vault({ params }: { params: { slug: string } }) {
    const [entries, setEntries] = useState<any>()
    const [isMe, setIsMe] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editingVid, setEditingVid] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState<number>(-1)
    const [sorting, setSorting] = useState({ type: "rating", asc: false })

    const auth = useAuth()

    useEffect(() => {
        async function fetchVault() {
            var res: any
            filter > -1 ?
                res = await auth.getVault(params.slug, sorting.type != "title" ? sorting : { type: "rating", asc: false }, filter) :
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

                var finalEntryDataArray: any = []


                if (sorting.type != "title") {
                    res.forEach((e: any, id: number) => {
                        const thisRes = vnData.find((y: any) => e.vid == y.id)
                        finalEntryDataArray.push({
                            ...e,
                            title: thisRes.title,
                            alttitle: thisRes.alttitle,
                            imageUrl: thisRes.image.url,
                            titles: thisRes.titles
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
            }

            setEntries(finalEntryDataArray)
            setIsLoading(false)
        }

        setEntries({})
        setIsLoading(true)
        fetchVault()
    }, [isEditing, sorting, filter])

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
                <div className="w-full block *:m-1 *:inline-block">
                    <AccentButton className={filter == -1 && "bg-white/10"} onClick={() => setFilter(-1)}>All</AccentButton>
                    <AccentButton className={filter == 0 && "bg-white/10"} onClick={() => setFilter(0)}>Finished</AccentButton>
                    <AccentButton className={filter == 1 && "bg-white/10"} onClick={() => setFilter(1)}>In progress</AccentButton>
                    <AccentButton className={filter == 2 && "bg-white/10"} onClick={() => setFilter(2)}>Not read</AccentButton>
                    <AccentButton className={filter == 3 && "bg-white/10"} onClick={() => setFilter(3)}>Dropped</AccentButton>
                </div>
                <Table>
                    <Headers
                    leftPadding={isMe ? 104 : 0}
                        sort={{
                            type:
                                sorting.type == "rating" ? 4 :
                                    sorting.type == "created_at" ? 1 :
                                        sorting.type == "updated_at" ? 2 :
                                            sorting.type == "status" && 3
                            , asc: sorting.asc
                        }}
                        fields={['Updated', 'Status', 'Rating']}
                        sortingCallback={[titleSort, lastUpdateSort, statusSort, ratingSort]}
                    />
                    {entries && entries.length > 0 ? (
                        entries.map((entry: any, index: number) => {
                            return (
                                <Entry key={index} entry={entry} isMe={isMe} setIsEditing={setIsEditing} setEditingVid={setEditingVid} />
                            )
                        })
                    ) : (
                        isLoading ? (
                            <p className="text-center">Loading...</p>
                        ) : (
                            <div>
                                <p className="text-center">No vns in vault :(</p>
                            </div>
                        )
                    )
                    }
                </Table>
            </div >
        </div >
    )
}

function Entry({ entry, isMe, setIsEditing, setEditingVid, key, ...props }: any) {
    function toggleEditing() {
        setEditingVid(entry.vid)
        setIsEditing(true)
    }

    console.log(entry)

    return (
        <div {...props} key={key}>
            {entry && <Row
                href={"/novel/" + entry.vid}
                iconUrl={entry && entry.imageUrl}
                fields={[
                    <p key={key} className="">{entry.updated_at.split('T')[0]}</p>,
                    <p key={key} className="">{getVaultStatusText(entry.status)}</p>,
                    entry.rating ? <RatingBadge rating={entry.rating} /> : <p className="text-right ">Unrated</p>
                ]}
                hasIcon
                title={getEnglishTitle(entry)}
                subtitle={entry.alttitle}
                actionContent={isMe && (
                    <div onClick={toggleEditing} className="group w-fit hidden lg:flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10">
                        <h4 className="duration-300 group-hover:text-blue-500 group-hover:font-bold">
                            Edit
                        </h4>
                        <EditSVG className="w-8 h-8 pl-2 stroke-white  stroke-2 group-hover:stroke-[3px]  group-hover:stroke-blue-500 duration-300" />
                    </div>
                )}
            />}
        </div>
    )
}
