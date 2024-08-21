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
import { characterListSearchById, vnListSearchById } from "@/utils/vndb";
import { getEnglishTitle } from "@/utils/vn-data";

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
                const res = await vnListSearchById(fetchedUserData.favorite_novels)

                setFavNovelData(res)
            }
            else {
                setFavNovelData([])
            }

            if (fetchedUserData.favorite_characters?.length > 0) {
                const res = await characterListSearchById(fetchedUserData.favorite_characters)

                setFavCharacterData(res)
            }
            else {
                setFavCharacterData([])
            }
        }

        fetchProfile()
    }, [auth, isEditingFavs])


    const modalContent: any = document.getElementById('modal-content');

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
                <div className="flex-col flex items-center gap-8">
                    <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
                        <div className="flex-col flex gap-2">
                            <h1>Recent updates</h1>
                            <div className="flex  items-end gap-4">
                                {stats.recentUpdates.map((update: any, id: number) => (
                                    <RecentUpdate update={stats.recentUpdates[id]} key={id} />
                                ))}
                            </div>
                        </div>
                        <div className="grid  grid-cols-1 grid-rows-1 items-center align-middle justify-items-center relative">
                            <div className="absolute flex flex-col gap-0 justify-center items-center bottom-0 top-0 left-0 right-0 w-full h-full">
                                <h1>
                                    {stats.totalVnsInList}
                                </h1>
                                <p className=" text-neutral-500 text-sm">
                                    Novels in vault
                                </p>
                            </div>
                            <PieChart data={stats.vaultStats} />
                        </div>
                    </div>
                    <div className="flex-col flex w-full items-center gap-2">
                        <h1 className="flex items-center gap-4">
                            Favorite novels
                            {isMe && (
                                <button onClick={() => { setEditingType(0); setIsEditingFavs(true) }}>
                                    <EditSVG className="w-8 hover:stroke-blue-500 duration-300" />
                                </button>
                            )}
                        </h1>
                        <div className="flex w-full max-w-[90vw] lg:grid lg:overflow-x-auto overflow-x-scroll grid-cols-3 gap-4">
                            {favNovelData?.length > 0 ? favNovelData?.map((novel: any, id: number) => {
                                return (
                                    <Link href={"/novel/" + novel.id} key={id} className="flex-col lg:min-w-[0px] min-w-[300px] flex gap-2">
                                        <img className="rounded-xl" src={novel.image.url} alt="" width="300" height="300" />
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
                    <div className="flex-col flex w-full items-center gap-2">
                        <h1 className="flex items-center gap-4">
                            Favorite characters
                            {isMe && (
                                <button onClick={() => { setEditingType(1); setIsEditingFavs(true) }}>
                                    <EditSVG className="w-8 hover:stroke-blue-500 duration-300" />
                                </button>
                            )}
                        </h1>
                        <div className="flex w-full max-w-[90vw] lg:grid lg:overflow-x-auto overflow-x-scroll grid-cols-3 gap-4">
                            {favCharacterData?.length > 0 ? favCharacterData?.map((character: any, id: number) => {
                                return (
                                    <Link href={"/character/" + character.id} key={id} className="flex-col lg:min-w-[0px] min-w-[300px] flex gap-2">
                                        <img className="rounded-xl" src={character.image.url} alt="" width="300" height="300" />
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
            </div>
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