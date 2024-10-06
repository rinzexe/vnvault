import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import VaultEdit from "./vault-edit"
import { IVN } from "@/types/vn"
import { IVNVaultEntry } from "@/types/vault"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Edit2 } from "lucide-react"

interface IVNCardProps {
    vnData: IVN
    entry?: IVNVaultEntry
    date?: string
    rating?: number
    badgeText?: string
    isMe?: boolean
}

export default function VNCard({ vnData, entry, date, rating, badgeText, isMe }: IVNCardProps) {
    const router = useRouter();

    const handleNavigation = () => {
        router.push(`/novel/${vnData.id}`);
    };

    return (
        <div onClick={handleNavigation} className="hover:cursor-pointer">
            <Card key={vnData.id} className="overflow-hidden hover:bg-foreground/10 duration-300">
                <CardContent className="p-0">
                    <div className="relative">
                        <Image
                            src={vnData.cover.url}
                            alt={vnData.title}
                            width={300}
                            height={450}
                            className="w-full h-[300px] object-cover"
                        />
                        {badgeText && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                                {badgeText}
                            </div>
                        )}
                        {rating != 0 && (
                            <div className="absolute bottom-2 right-2 bg-accent text-black font-bold px-2 py-1 rounded">
                                <span className="text-lg font-bold text-white">{rating}</span>
                                <span className="text-sm text-muted-foreground ml-1">/10</span>
                            </div>
                        )}
                        {entry && isMe && (
                            <div className="absolute top-2  left-2 hover:bg-opacity-70" onClick={(e) => e.stopPropagation()}>
                                <VaultEdit entryData={entry}>
                                    <Button variant="ghost" className="rounded-md p-2 bg-black bg-opacity-70 text-white w-9 h-9" size="sm">
                                        <Edit2 className="h-full w-full text-white hover:text-white" />
                                    </Button>
                                </VaultEdit>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg truncate">{vnData.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{vnData.altTitle}</p>
                        {date && (
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-sm text-muted-foreground">
                                    {date}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function VNCardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                        <Skeleton className="h-[300px] w-full" />
                        <div className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}