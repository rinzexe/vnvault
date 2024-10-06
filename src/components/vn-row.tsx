import { IVNVaultEntry } from "@/types/vault"
import { IVN } from "@/types/vn"
import { TableCell, TableRow } from "./ui/table"
import VaultEdit from "./vault-edit"
import { useRouter } from "next/navigation"
import { Edit2 } from "lucide-react"

interface IVNRowProps {
    vnData: IVN
    entry?: IVNVaultEntry
    rating?: number
    fields?: string[]
    isMe?: boolean
}

export default function VNRow({ vnData, entry, rating, fields, isMe }: IVNRowProps) {
    const router = useRouter();

    const handleNavigation = () => {
        router.push(`/novel/${vnData.id}`);
    };

    return (
        <TableRow key={vnData.id} className="hover:cursor-pointer" onClick={handleNavigation}>
            <TableCell className="w-20">
                <img
                    src={vnData.cover.url}
                    alt={vnData.title}
                    width={50}
                    height={75}
                    className="object-cover w-20 rounded"
                />
            </TableCell>
            <TableCell>
                <div className="font-medium">{vnData.title}</div>
                <div className="text-sm text-muted-foreground">{vnData.altTitle}</div>
            </TableCell>
            {fields?.map((field: string, id: number) => (
                <TableCell key={id} className="text-center">{field}</TableCell>
            ))}
            <TableCell>
                {rating === 0 ? (
                    <span className="text-xs font-bold flex justify-end text-right text-white">Unrated</span>
                ) : (
                    <div className="flex items-center justify-end">
                        <span className="text-lg font-bold text-accent">{rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">/10</span>
                    </div>
                )}
            </TableCell>
            {isMe && entry && <TableCell onClick={(e) => e.stopPropagation()}>
                <VaultEdit entryData={entry}>
                    <Edit2 className="text-foreground" />
                </VaultEdit>
            </TableCell>}
        </TableRow>
    );
}
