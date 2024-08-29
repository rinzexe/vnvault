import PieChart from "@/app/_components/charts/pie-chart";
import LevelBar from "@/app/_components/level-bar";
import { Stats } from "../../[slug]/client-page";
import getStatusName from "@/consts/status";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FavoriteEditingModal from "../favorite-editing-modal";
import EditSVG from "@/app/_components/svgs/edit";
import { useAuth } from "@/app/_components/auth-provider";
import { getEnglishTitle } from "@/utils/vn-data";
import { characterSearchByIdList, vnSearchByIdList } from "@/lib/vndb/search";
import Table from "@/app/_components/table/table";
import RatingBadge from "@/app/_components/rating-badge";
import ImageWithSkeleton from "@/app/_components/image-with-skeleton";

export default function Info({ stats, isMe, username }: any) {
    const [isEditingFavs, setIsEditingFavs] = useState<boolean>(false)
    const [editingType, setEditingType] = useState<number>(0)
    const [userData, setProfile] = useState<any>(null)
    const [favNovelData, setFavNovelData] = useState<any>()
    const [favCharacterData, setFavCharacterData] = useState<any>()

    const auth = useAuth()

    useEffect(() => {
        async function fetchProfile() {
            const fetchedUserData = await auth.getUserDataWithUsername(username)

            setProfile(fetchedUserData)

            if (fetchedUserData.favorite_novels?.length > 0) {
                const res = await vnSearchByIdList(fetchedUserData.favorite_novels)

                console.log(res)

                setFavNovelData(res)
            }
            else {
                setFavNovelData([])
            }

            if (fetchedUserData.favorite_characters?.length > 0) {
                console.log(fetchedUserData.favorite_characters)
                const res = await characterSearchByIdList(fetchedUserData.favorite_characters)

                setFavCharacterData(res)
            }
            else {
                setFavCharacterData([])
            }
        }

        fetchProfile()
    }, [auth, isEditingFavs])


    const modalContent: any = document.getElementById('modal-content');

    /*     href: string
        iconUrl?: string
        fields: any[]
        title: string
        subtitle?: string
        editingCallback?: any
        avatarUser?: any
        numbered?: boolean
        roundIcons?: boolean
        hasIcon?: boolean
        actionContent?: any
        cardFields?: { hover?: any, right?: any, left?: any }
        tags?: any[]
        dims?: any
        key: number */

    return (
        <>
            {modalContent && isEditingFavs && createPortal((
                <div className="fixed w-full h-full flex items-center justify-center bg-black/75 z-50">
                    <div onClick={() => { setIsEditingFavs(false) }} className="absolute w-full h-full">
                    </div>
                    <FavoriteEditingModal favorites={editingType == 0 ? favNovelData : favCharacterData} type={editingType} setIsEditingFavs={setIsEditingFavs} userData={userData} />
                </div>
            ), modalContent)}
            <div>
                <div className="flex-col flex items-center gap-12">
                    <div className="flex flex-col lg:grid grid-cols-2 gap-12 w-full">
                        <div className="flex-col flex gap-2 w-full">
                            <h1>Recently updated</h1>
                            <Table
                                isLoading={false}
                                acceptedTypes={{ row: true, card: false }}
                                entries={
                                    stats.recentUpdates.map((update: any, id: number) => {
                                        return {
                                            title: update.title,
                                            hasIcon: true,
                                            iconUrl: update.image.thumbnail,
                                            dims: update.image.thumbnail_dims,
                                            fields: [<p key={id}>{update.updatedAt.split('T')[0]}</p>, <p key={id}>{getStatusName(update.status)}</p>],
                                            key: id,
                                            href: "/profile/" + username + "/vault"
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="flex-col flex w-full lg:items-center gap-2">
                            <h1 className="flex lg:items-center gap-4">
                                Favorite novels
                                {isMe && (
                                    <button className="lg:block hidden" onClick={() => { setEditingType(0); setIsEditingFavs(true) }}>
                                        <EditSVG className="w-8 hover:stroke-blue-500 duration-300" />
                                    </button>
                                )}
                            </h1>
                            <div className="flex w-full max-w-[90vw] lg:grid lg:overflow-x-auto overflow-x-scroll grid-cols-3 gap-4">
                                {favNovelData?.length > 0 ? favNovelData?.map((novel: any, id: number) => {
                                    return (
                                        <Link href={"/novel/" + novel.id} key={id} className="flex-col lg:min-w-[0px] min-w-[300px] flex gap-2">
                                            <ImageWithSkeleton className="rounded-xl" src={novel.image.thumbnail} dims={novel.image.thumbnail_dims} />
                                            <div>
                                                <h2>
                                                    {getEnglishTitle(novel)}
                                                </h2>
                                                <p className=" text-neutral-500">
                                                    {novel.alttitle}
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                }) : (
                                    <>
                                        <div>

                                        </div>
                                        <p className="text-center">
                                            No favorite novels :(
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:grid grid-cols-2 w-full gap-12">
                        <div className="flex-col flex gap-2 w-full">
                            <h1>Recently rated</h1>
                            <Table
                                isLoading={false}
                                acceptedTypes={{ row: true, card: false }}
                                entries={
                                    stats.recentRates.map((update: any, id: number) => {
                                        return {
                                            title: update.title,
                                            hasIcon: true,
                                            iconUrl: update.image.thumbnail,
                                            dims: update.image.thumbnail_dims,
                                            fields: [<p key={id}>{update.updatedAt.split('T')[0]}</p>, <RatingBadge key={id} rating={update.rating} />],
                                            key: id,
                                            href: "/profile/" + username + "/vault"
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="flex-col flex lg:items-center gap-2 w-full">
                            <h1 className="flex lg:items-center gap-4">
                                Favorite characters
                                {isMe && (
                                    <button className="lg:block hidden" onClick={() => { setEditingType(1); setIsEditingFavs(true) }}>
                                        <EditSVG className="w-8 hover:stroke-blue-500 duration-300" />
                                    </button>
                                )}
                            </h1>
                            <div className="flex w-full max-w-[90vw] lg:grid lg:overflow-x-auto overflow-x-scroll grid-cols-3 gap-4">
                                {favCharacterData?.length > 0 ? favCharacterData?.map((character: any, id: number) => {
                                    return (
                                        <Link href={"/character/" + character.id} key={id} className="flex-col lg:min-w-[0px] min-w-[300px] flex gap-2">
                                           <ImageWithSkeleton className="rounded-xl" src={character.image.url} dims={character.image.dims} />
                                            <div>
                                                <h2>
                                                    {character.name}
                                                </h2>
                                            </div>
                                        </Link>
                                    )
                                }) : (
                                    <>
                                        <div>

                                        </div>
                                        <p className="text-center">
                                            No favorite characters :(
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

function RecentUpdate({ update, key }: any) {
    return (
        <Link key={key} href={"/novel/" + update.id} className="flex-col flex gap-2">
            <img className="rounded-xl" src={update.image.url} alt="" width="300" height="300" />
            <div>
                <p>
                    Added to: {getStatusName(update.status)}
                </p>
                <p className="text-xs text-neutral-500">
                    {update.updatedAt.split('T')[0]}
                </p>
            </div>
        </Link>
    )
}