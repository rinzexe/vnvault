import { ReactNode, useState } from "react"
import { IVaultStatus, IVNVaultEntry } from "@/types/vault"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"
import { useAuth } from "./auth-provider"

interface IVaultEditProps {
    entryData?: IVNVaultEntry
    vnId?: number
    vnTitle?: string
    children: ReactNode
}

interface IEditingData {
    rating: number | null // Allow for unrated by setting it to null
    status: IVaultStatus
    isRated: boolean // Flag to handle rated/unrated
}

export default function VaultEdit({ entryData, vnId, vnTitle, children }: IVaultEditProps) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [editingData, setEditingData] = useState<IEditingData>({
        rating: entryData ? (entryData.rating === 0 ? null : entryData.rating) : null,
        status: entryData ? entryData.status : IVaultStatus.ToRead,
        isRated: entryData ? entryData.rating !== 0 : false,
    })

    const auth = useAuth()

    function handleRatingChange(increment: number) {
        if (editingData.rating === null) {
            setEditingData({ ...editingData, rating: 1 }) // Set to 1 if it's unrated
        } else {
            const newRating = Math.min(Math.max(editingData.rating + increment, 1), 10)
            setEditingData({ ...editingData, rating: Number(newRating.toFixed(1)) })
        }
    }

    function handleSave(remove: boolean = false) {
        const ratingValue = editingData.isRated ? editingData.rating ?? 1 : 0

        const vaultVnId = vnId ?? entryData?.vn.id
        if (!vaultVnId) {
            console.error("VN ID is missing")
            return
        }

        auth.db.vaults.updateVault(
            auth.user?.id!,
            Math.min(Math.max(ratingValue, 0), 10),
            Object.values(IVaultStatus).indexOf(editingData.status),
            vaultVnId,
            remove // Pass the remove flag
        )

        auth.forceRerender()
        setIsDialogOpen(false)
    }

    function handleRatingOptionChange(isRated: boolean) {
        setEditingData({
            ...editingData,
            isRated,
            rating: isRated ? editingData.rating ?? 1 : null, // Set rating to null if unrated, or 1 for rated
        })
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div onClick={() => setIsDialogOpen(true)}>
                {children}
            </div>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="w-5/6">
                    <DialogTitle>
                        <span className="font-light">
                            {entryData ? "Edit entry for " : "Add entry for "}
                        </span>
                        <span className="italic">
                            {entryData ? entryData.vn.title : vnTitle}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Status Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select
                            value={editingData.status}
                            onValueChange={(value) =>
                                setEditingData({ ...editingData, status: value as IVaultStatus })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={IVaultStatus.Finished}>{IVaultStatus.Finished}</SelectItem>
                                <SelectItem value={IVaultStatus.Reading}>{IVaultStatus.Reading}</SelectItem>
                                <SelectItem value={IVaultStatus.Dropped}>{IVaultStatus.Dropped}</SelectItem>
                                <SelectItem value={IVaultStatus.ToRead}>{IVaultStatus.ToRead}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Rated or Unrated Selection */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rating-option" className="text-right">
                            Rating
                        </Label>
                        <div className="col-span-3">
                            <Button
                                variant={editingData.isRated ? "default" : "ghost"}
                                onClick={() => handleRatingOptionChange(true)}
                                className="mr-2"
                            >
                                Rated
                            </Button>
                            <Button
                                variant={!editingData.isRated ? "default" : "ghost"}
                                onClick={() => handleRatingOptionChange(false)}
                            >
                                Unrated
                            </Button>
                        </div>
                    </div>

                    {/* Rating Input (conditionally shown if Rated is selected) */}
                    {editingData.isRated && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rating" className="text-right">
                                Value
                            </Label>
                            <div className="col-span-3 flex items-center space-x-2">
                                <Button variant="outline" size="icon" onClick={() => handleRatingChange(-1)}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    id="rating"
                                    type="number"
                                    value={editingData.rating?.toFixed(1) ?? ""}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            rating: Number(parseFloat(e.target.value).toFixed(1)),
                                        })
                                    }
                                    min={1}
                                    max={10}
                                    step={0.1}
                                    className="w-20 text-center"
                                />
                                <Button variant="outline" size="icon" onClick={() => handleRatingChange(1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-between">
                    {entryData && (
                        <Button variant="destructive" onClick={() => handleSave(true)}>
                            Delete Entry
                        </Button>
                    )}
                    <Button onClick={() => handleSave()}>
                        {entryData ? "Save Changes" : "Add Entry"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
