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
import Table from "@/app/_components/table/table";
import { getVnLengthName } from "@/utils/vn-length";
import { getEnglishTitle } from "@/utils/vn-data";

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
        <div className="w-full flex flex-col max-w-page gap-4 items-center">
            <div className="w-full">
                {charData && (
                    <div className="w-full flex flex-col gap-8 items-center">
                        <div className="w-full flex flex-col gap-4 items-center">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-center">
                                {charData.image && <img className="rounded-xl" src={charData.image.url} alt="" width={500} height={800} />}
                                <div className="flex flex-col h-full justify-center">
                                    <h3 className="text-neutral-400">{charData.original}</h3>
                                    <h1>{charData.name}</h1>
                                    <div className="col-start-2 col-end-4 max-w-96">
                                        {charData.description && <p dangerouslySetInnerHTML={{ __html: formatDescription(charData.description) }} className="text-sm"></p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-4 items-center">
                            <h1>
                                Related novels:
                            </h1>
                            <div className="w-full max-w-[1000px]">
                                <Table
                                    isLoading={charData == null}
                                    acceptedTypes={{ row: true, card: false }}
                                    headers={{
                                        fields: ['Role', 'Rating'],
                                    }}
                                    entries={
                                        charData.vns.map((vn: any, id: number) => {
                                            return {
                                                cardFields: {
                                                    right: <RatingBadge key={id} className="mt-4" rating={vn.rating / 10} />,
                                                    left:
                                                        (<div key={id} className="*:text-center">
                                                            <p>
                                                                {getCharacterRoleName(vn.role)}
                                                            </p>
                                                        </div>)
                                                },
                                                hasIcon: true,
                                                href: "/novel/" + vn.id,
                                                dims: vn.image && vn.image.thumbnail_dims,
                                                iconUrl: vn.image && vn.image.thumbnail,
                                                fields: [(
                                                    <div key={id} className="*:text-center">
                                                        <p>
                                                            {getCharacterRoleName(vn.role)}
                                                        </p>
                                                    </div>
                                                ), (
                                                    <RatingBadge key={id} rating={vn.rating / 10} />
                                                )],
                                                title: getEnglishTitle(vn),
                                                subtitle: vn.alttitle
                                            }
                                        })
                                    }
                                />
                            </div>
                            <div className="w-full columns-3 ">
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
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