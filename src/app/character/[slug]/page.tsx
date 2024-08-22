
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
import ClientCharacter from "./client-page";
import { characterSearchByIdList } from "@/lib/vndb/search";

export async function generateMetadata({ params }: any) {
    const res = await characterSearchByIdList([params.slug])

    return {
        openGraph: {
            siteName: "VNVault",
            description: res[0].description,
            title: res[0].title,
            images: [
                {
                    url: res[0].image && res[0].image.url
                }
            ]
        }
    }
}

export default async function Character({ params }: { params: { slug: string } }) {

    return (
        <ClientCharacter params={{ slug: params.slug }} />
    );
}
