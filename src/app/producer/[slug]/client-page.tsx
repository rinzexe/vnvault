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
import EditSVG from "@/app/_components/svgs/edit";
import Table from "@/app/_components/table/table";
import Headers from "@/app/_components/table/headers";
import { developerSearchByIdList, vnSearchByDeveloper } from "@/lib/vndb/search";
import Row from "@/app/_components/table/table-entry";
import { getEnglishTitle } from "@/utils/vn-data";
import { getVnLengthName } from "@/utils/vn-length";

export default function ClientProducer({ params }: { params: { slug: string } }) {
    const [prodData, setProdData] = useState<any>(null)
    const [vnData, setVnData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sorting, setSorting] = useState({ type: "rating", asc: false })
    const [entries, setEntries] = useState<any>()

    const auth = useAuth()

    useEffect(() => {
        async function fetchcharData() {
            const res = await developerSearchByIdList([params.slug])



            setProdData(res[0])
        }

        fetchcharData()
    }, [])

    useEffect(() => {
        setIsLoading(true)
        async function fetchVns() {
            const vnRes = await vnSearchByDeveloper(prodData.id, sorting)

            setEntries(vnRes)
            setIsLoading(false)
        }
        prodData && fetchVns()
    }, [sorting, prodData])

    function ratingSort() {
        setSorting({ type: "rating", asc: !sorting.asc })
    }

    function titleSort() {
        setSorting({ type: "title", asc: !sorting.asc })
    }

    function releaseDateSort() {
        setSorting({ type: "released", asc: !sorting.asc })
    }


    return (
        <div className="w-full flex flex-col gap-4 items-center">
            <div className="w-full">
                {prodData && (
                    <div className="w-full flex flex-col gap-8 items-center">
                        <div className="w-full flex flex-col gap-4 items-center">
                            <div className="flex flex-col gap-4 w-full max-w-[40rem]">
                                <div className="flex flex-col h-full justify-center items-center w-full">
                                    <h3 className="text-neutral-400">{prodData.original}</h3>
                                    <h1>{prodData.name}</h1>
                                    <div className="col-start-2 col-end-4">
                                        {prodData.description && <p dangerouslySetInnerHTML={{ __html: formatDescription(prodData.description) }} className="text-sm text-center"></p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full max-w-[1000px] gap-4 items-center">
                            <h1 >
                                Developed novels:
                            </h1>
                            <div className="w-full ">
                                <Table
                                    isLoading={isLoading}
                                    acceptedTypes={{ row: true, card: false }}
                                    headers={{
                                        sort: {
                                            type:
                                                sorting.type == "rating" ? 3 :
                                                    sorting.type == "title" ? 0 :
                                                        2
                                            , asc: sorting.asc
                                        },
                                        sortingCallback: [titleSort, , releaseDateSort, ratingSort],
                                        fields: ['Length', 'Released', 'Rating'],
                                    }}
                                    entries={
                                        entries && entries.map((vn: any, id: number) => {
                                            return {
                                                hasIcon: true,
                                                href: "/novel/" + vn.id,
                                                dims: vn.image && vn.image.thumbnail_dims,
                                                iconUrl: vn.image && vn.image.thumbnail,
                                                fields: [(
                                                    <p key={id}>{getVnLengthName(vn.length)}</p>
                                                ), (
                                                    <p key={id}>{vn.released}</p>
                                                ), (
                                                    <div key={id} className="flex justify-end">
                                                        <RatingBadge rating={vn.rating / 10} />
                                                    </div>)

                                                ],
                                                title: getEnglishTitle(vn),
                                                subtitle: vn.alttitle
                                            }
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
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