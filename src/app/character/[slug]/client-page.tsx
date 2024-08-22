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
import { characterSearchByIdList } from "@/lib/vndb/search";
import { getCharacterRoleName } from "@/utils/character-roles";

export default function ClientCharacter({ params }: { params: { slug: string } }) {
    const [charData, setCharData] = useState<any>(null)

    const auth = useAuth()

    useEffect(() => {
        async function fetchcharData() {
            const res = await characterSearchByIdList([params.slug])

            setCharData(res[0])
        }

        fetchcharData()
    }, [])

    const modalContent: any = document.getElementById('modal-content');

    return (
        <div className="w-full flex flex-col gap-4 items-center">
            <div className="max-w-[60rem]">
                {charData && (
                    <div className="w-full flex flex-col gap-8 items-center">
                        <div className="w-full flex flex-col gap-4 items-center">
                            <div className="flex flex-col gap-4 lg:grid grid-cols-2 lg:gap-8">
                                <img className="rounded-xl" src={charData.image.url} alt="" width={500} height={800} />
                                <div className="flex flex-col h-full justify-center">
                                    <h3 className="text-neutral-400">{charData.original}</h3>
                                    <h1>{charData.name}</h1>
                                    <div className="col-start-2 col-end-4">
                                        {charData.description && <p dangerouslySetInnerHTML={{ __html: formatDescription(charData.description) }} className="text-sm"></p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 items-center">
                            <h1 >
                                Related novels:
                            </h1>
                            <div className="w-full columns-3 ">
                                {charData.vns.map((vn: any, id: number) => (
                                    <CharacterCard key={id} vn={vn} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CharacterCard({ vn, key }: any) {
    return (
        <div className="inline-block p-4">
            <Link href={"/novel/" + vn.id} key={key} className="flex flex-col gap-2 w-full">
                <img className="rounded-xl" src={vn.image.url} />
                <div>
                    <h2>
                        {vn.title}
                    </h2>
                    <p className=" text-neutral-500">
                        {getCharacterRoleName(vn.role)}
                    </p>
                </div>
            </Link>
        </div>
    )
}

function InfoRow({ label, value }: any) {
    return (
        <div className="flex items-center gap-2 justify-between">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="text-end">{value}</p>
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