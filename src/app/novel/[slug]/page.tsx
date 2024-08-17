
import { getGameLinks, getVnData } from "./actions";
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
import { Metadata } from "next";
import ClientNovel from "./client-page";

export async function generateMetadata({ params }: any) {
    const res = await getVnData(params.slug)

    const englishTitle = res.titles.find((title: any) => title.lang == "en")

    var mainTitle = res.title

    if (englishTitle) {
        mainTitle = englishTitle.title
    }


    const vnData = { ...res, title: mainTitle }
    return {
        title: vnData.maintitle,
        openGraph: {
            siteName: "VNVault",
            description: vnData.description,
            title: vnData.mainTitle,
            images: [
                {
                    url: vnData.image.url
                }
            ]
        }
    }
}

export default async function Novel({ params }: { params: { slug: string } }) {

    return (
        <ClientNovel params={{ slug: params.slug }} />
    );
}
