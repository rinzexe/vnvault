'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import RatingBadge from "@/app/_components/rating-badge";
import Badge from "@/app/_components/badge";
import AccentButton from "@/app/_components/accent-button";
import HeartSVG from "@/app/_components/svgs/heart";
import PlusSVG from "@/app/_components/svgs/plus";
import Link from "next/link";
import { useAuth } from "@/app/_components/auth-provider";
import { createPortal } from "react-dom";
import VaultEditor from "../../_components/vault-editor";
import EditSVG from "@/app/_components/svgs/edit";
import { getGameLinks } from "./actions";
import { characterSearchByVnId, getVnDataById } from "@/lib/vndb/search";
import { getCharacterRoleName } from "@/utils/character-roles";

export default function ClientNovel({ params }: { params: { slug: string } }) {
    const [vnData, setVnData] = useState<any>(null)
    const [characterData, setCharacterData] = useState<any>(null)
    const [gameLinks, setGameLinks] = useState<any>(null)
    const [isEditing, setIsEditing] = useState<any>(null)
    const [isInVault, setIsInVault] = useState<any>(false)

    const auth = useAuth()

    useEffect(() => {
        async function fetchVnData() {
            const res = await getVnDataById(params.slug)

            const englishTitle = res.titles.find((title: any) => title.lang == "en")

            var mainTitle = res.title

            if (englishTitle) {
                mainTitle = englishTitle.title
            }

            if (auth.user) {
                const userRes = await auth.getUserData(auth.user.id)
                const res3 = await auth.getVault(userRes.username)

                if (res3.find((entry: any) => entry.vid == params.slug)) {
                    setIsInVault(true)
                }
            }

            setVnData({ ...res, title: mainTitle })

            const res2 = await getGameLinks(mainTitle)

            setGameLinks(res2)

            const charRes = await characterSearchByVnId(res.id)

            charRes.sort((a: any, b: any) => {
                const aRole = a.vns.filter((v: any) => v.id == res.id)[0].role
                const bRole = b.vns.filter((v: any) => v.id == res.id)[0].role
                
                if (aRole == 'main') {
                    return -1
                }
            })

            setCharacterData(charRes)
        }

        fetchVnData()
    }, [isEditing])

    const modalContent: any = document.getElementById('modal-content');

    return (
        <div className="w-full flex flex-col gap-4 items-center">
            {vnData && isEditing && createPortal((
                <div className="fixed w-full h-full flex items-center justify-center bg-black/75 z-50">
                    <div onClick={() => { setIsEditing(false) }} className="fixed w-full h-full">
                    </div>
                    <VaultEditor isInVault={isInVault} setIsEditing={setIsEditing} vid={vnData.id} />
                </div>
            ), modalContent)}
            <div className="max-w-[60rem]">
                {vnData && (
                    <div className="w-full flex flex-col gap-8 items-center">
                        <div className="w-full flex flex-col gap-4 items-center">
                            <div className="flex flex-col gap-4 lg:grid grid-cols-2 lg:gap-8">
                                <img className="rounded-xl" src={vnData.image.url} alt="" width={500} height={800} />
                                <div className="flex flex-col h-full justify-center">
                                    <h3 className="text-neutral-400">{vnData.alttitle}</h3>
                                    <h1>{vnData.title}</h1>
                                    <div className="flex mb-2 gap-2 items-center">
                                        <RatingBadge justify="start" rating={vnData.rating / 10} />
                                        <p className="text-xs text-neutral-500">
                                            {"(" + vnData.votecount + ")"}
                                        </p>
                                    </div>
                                    {auth.user && (
                                        <div onClick={() => setIsEditing(true)} className="group w-fit flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10">
                                            <h4 className="duration-300 group-hover:text-blue-500 group-hover:font-bold">
                                                {isInVault && vnData ? "Edit vault" : "Add to vault"}
                                            </h4>
                                            {isInVault ?
                                                <EditSVG className="w-8 h-8 pl-2 stroke-white  stroke-2 group-hover:stroke-[3px]  group-hover:stroke-blue-500 duration-300" />
                                                :
                                                <PlusSVG className="stroke-white h-9 w-9 fill-white stroke-0 group-hover:stroke-1 group-hover:fill-blue-500 group-hover:stroke-blue-500 duration-300 " />}

                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col lg:grid gap-4 grid-cols-3 w-full">
                                <div className="panel h-min">
                                    <InfoRow label="Released" value={vnData.released} />
                                    <Link href={"/producer/" + vnData.developers[0].id}><InfoRow label="Developer" className="text-blue-500" value={vnData.developers[0].name} /></Link>
                                    <InfoRow label="Developer jpn" value={vnData.developers[0].original} />
                                    <InfoRow label="Languages" value={vnData.languages.join(' ')} />
                                    <InfoRow label="Length" value={Math.round(vnData.length_minutes / 60) + "h"} />
                                    <InfoRow label="Development status" value={getStatusName(vnData.devstatus)} />
                                    <InfoRow label="Orgininal language" value={vnData.olang} />
                                </div>
                                <div className="col-start-2 col-end-4">
                                    {vnData.description && <p dangerouslySetInnerHTML={{ __html: formatDescription(vnData.description) }} className="text-sm"></p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full items-center gap-2">
                            <h1>
                                Distribution
                            </h1>
                            <p className="text-neutral-500 text-xs text-center">
                                {"These are work in progress, and might not be accurate. Check the game's name before buying"}
                            </p>
                            {gameLinks && (gameLinks.steam || gameLinks.gog) ? (
                                <div className="flex lg:flex-row flex-col gap-4">
                                    {gameLinks?.steam && <GameLink logo="/company logos/steam.png" href={gameLinks.steam} name="Steam" />}
                                    {gameLinks?.gog && <GameLink logo="/company logos/gog.png" href={gameLinks.gog} name="GOG" />}
                                </div>
                            ) :
                                gameLinks ? (
                                    <p>
                                        No sales channels found
                                    </p>
                                ) : (
                                    <div className="w-full relative">
                                        <div className="p-2 absolute bottom-0 z-10 left-0 top-0 right-0 w-full h-full backdrop-blur-md bg-black/50">
                                        </div>
                                        <div className="p-2 flex gap-4 justify-center">
                                            <GameLink logo="/company logos/steam.png" href="/" name="Steam" />
                                            <GameLink logo="/company logos/gog.png" href="/" name="GOG" />
                                        </div>
                                    </div>
                                )}
                        </div>
                        {characterData && characterData.length > 0 && (
                            <div className="flex flex-col items-center w-full">
                                <h1>
                                    Characters
                                </h1>
                                <div className=" w-full columns-3">
                                    {characterData.map((character: any, id: number) => (
                                        <Link key={id} href={"/character/" + character.id} className="inline-block mb-4 hover:bg-white/10 duration-300 w-full panel">
                                            <img className="w-full rounded-lg" src={character.image.url} />
                                            <h2 className="pt-2">
                                                {character.name}
                                            </h2>
                                            <p className="">
                                                {getCharacterRoleName(character.vns.filter((v: any) => v.id == vnData.id)[0].role)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {vnData.screenshots.length > 0 && (
                            <div className="flex flex-col items-center w-full">
                                <h1>
                                    Screenshots
                                </h1>
                                <div className="w-full columns-2">
                                    {vnData.screenshots.map((screenshot: any, id: number) => (
                                        screenshot.sexual < 1 && <img width={500} height={400} className="inline-block mb-4 w-full rounded-md" key={id} src={screenshot.url} alt="" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusName(status: number) {
    switch (status) {
        case 0: {
            return "Released"
        }
        case 1: {
            return "Under development"
        }
        case 2: {
            return "Cancelled"
        }
    }
}

function GameLink({ logo, href, name }: any) {
    return (
        <Link href={href}>
            <div className="panel p-3 hover:bg-white/10 duration-300 flex gap-4 items-center">
                <img src={logo} alt="name" width={48} height={48} />
                <h4>
                    {"Buy on " + name}
                </h4>
            </div>
        </Link>
    )
}

function InfoRow({ label, value, className }: any) {
    return (
        <div className={"flex items-center gap-2 justify-between"}>
            <p className="text-sm text-neutral-500">{label}</p>
            <p className={["text-end", className].join(' ')}>{value}</p>
        </div>
    )
}

function formatDescription(text: string) {

    text = text.replaceAll("[From", "^")
    text = text.replaceAll("[Edited from", "^")
    text = text.replaceAll("[Translated from", "^")

    text = text.replace("]]", "^")
    text = text.replaceAll(/\^([^\^]+)\^/g, '');

    text = text.replaceAll("[spoiler]", "")
    text = text.replaceAll("[/spoiler]", "")

    text = text.replaceAll("[b]", "")
    text = text.replaceAll("[/b]", "")

    text = text.replaceAll("<s>", "")
    text = text.replaceAll("</s>", "")
    text = text.replaceAll(/\^([^\^]+)\^/g, '');

    text = text.replaceAll("[/url]", "")

    text = text.replaceAll("[url=/", "^")
    text = text.replaceAll("]", "^")
    text = text.replaceAll(/\^([^\^]+)\^/g, '');


    text = text.replaceAll('^', "")
    return text;
}