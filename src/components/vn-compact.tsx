import { IVNVaultEntry } from "@/types/vault"
import { IVN } from "@/types/vn"
import Image from "next/image"
import VaultEdit from "./vault-edit"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"

interface IVNCompactProps {
    vnData: IVN
    entry?: IVNVaultEntry
    rating?: number
    imageText?: string
    isMe?: boolean
}

import { useRouter } from 'next/navigation';
import { Button } from "./ui/button"
import { Edit2 } from "lucide-react"

export default function VNCompact({ vnData, entry, rating, imageText, isMe }: IVNCompactProps) {
    const router = useRouter();

    const handleNavigation = () => {
        router.push(`/novel/${vnData.id}`);
    };

    return (
        <div
            key={vnData.id}
            className="flex hover:bg-foreground/10 rounded duration-200 p-2 hover:cursor-pointer flex-col items-center text-center"
            onClick={handleNavigation}
        >
            <div className="relative">
                <Image
                    src={vnData.cover.url}
                    alt={vnData.title}
                    width={120}
                    height={180}
                    className="object-cover rounded"
                />
                {imageText && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-1 py-0.5 text-xs">
                        {imageText}
                    </div>
                )}
                {rating !== 0 && (
                    <div className="absolute top-0 right-0 bg-accent px-1 py-0.5 text-xs rounded-bl">
                        <div className="flex items-center">
                            <span className="text-md font-bold text-white">{rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">/10</span>
                        </div>
                    </div>
                )}
                {entry && isMe && (
                    <div
                        className="absolute top-0 left-0 p-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <VaultEdit entryData={entry}>
                            <Button variant="ghost" className="rounded-md p-[4px] bg-black bg-opacity-70 text-white w-7 h-7" size="sm">
                                <Edit2 className="h-full w-full" />
                            </Button>
                        </VaultEdit>
                    </div>
                )}
            </div>
            <h3 className="font-medium text-sm mt-2 truncate w-full">{vnData.title}</h3>
            <p className="text-xs text-muted-foreground truncate w-full">{vnData.altTitle}</p>
        </div>
    );
}


export function VNCompactSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                    <Skeleton className="h-[180px] w-[120px] mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    )
}