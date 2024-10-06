import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useDebouncedSearch from "@/hooks/use-debounced-search"
import { getVnBySearch, getCharacterBySearch } from "@/lib/vndb/search" // Adjust this to import character search
import { IUserProfile } from "@/types/user-profile"
import { IVNVaultEntry } from "@/types/vault"
import { IVNBasic } from "@/types/vn"
import { ICharacterBasic } from "@/types/character" // Assuming there's a character type
import { Edit, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Type guard function
function isIVNBasic(result: IVNBasic | ICharacterBasic): result is IVNBasic {
    return (result as IVNBasic).title !== undefined;
}

export interface FavoriteEditModalProps {
    username: string
    type: "vn" | "character"
}

export default function FavoriteEditModal({ username, type }: FavoriteEditModalProps) {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [editing, setEditing] = useState<boolean>(false)

    // State is either IVNBasic[] or ICharacterBasic[], based on the type
    const [searchResults, setSearchResults] = useState<IVNBasic[] | ICharacterBasic[]>([])
    const [tempFavorites, setTempFavorites] = useState<IVNBasic[] | ICharacterBasic[]>([])

    const auth = useAuth()
    const search = useDebouncedSearch(searchTerm)
    const router = useRouter()

    useEffect(() => {
        async function fetchSearch() {
            const userData: IUserProfile = await auth.db.users.getUserProfileByName(username)
            let res;

            if (type === "vn") {
                res = await getVnBySearch(search) as IVNBasic[];
                const favVNs = userData.favoriteVisualNovels as IVNBasic[];

                setTempFavorites([...tempFavorites, ...favVNs].filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                ) as IVNBasic[]);
            } else if (type === "character") {
                res = await getCharacterBySearch(search) as ICharacterBasic[];
                console.log(res)
                const favCharacters = userData.favoriteCharacters as ICharacterBasic[];

                setTempFavorites([...tempFavorites, ...favCharacters].filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                ) as ICharacterBasic[]); 
            }

            setSearchResults(res || []); 
        }

        fetchSearch();
    }, [search]);

    async function handleToggle(id: number) {
        const isFavorite = tempFavorites.filter((item: IVNBasic | ICharacterBasic) => item.id === id).length > 0;

        let newFavs: IVNBasic[] | ICharacterBasic[]

        if (isFavorite) {
            newFavs = tempFavorites.filter((item: IVNBasic | ICharacterBasic) => item.id !== id) as IVNBasic[] | ICharacterBasic[]
        } else {
            newFavs = [...tempFavorites, searchResults.find(item => item.id === id)].slice(0, 10) as IVNBasic[] | ICharacterBasic[]
        }

        if (type === "vn") {
            await auth.db.users.updateUser(auth.user?.id!, { favorite_novels: (newFavs as IVNBasic[]).map((fav) => "v" + fav.id) });
        } 
        else if (type === "character") {
            await auth.db.users.updateUser(auth.user?.id!, { favorite_characters: (newFavs as ICharacterBasic[]).map((fav) => "c" + fav.id) });
        }


        setTempFavorites(newFavs); 

    }

    function toggleEditing() {
        if (editing) {
            router.refresh();
        }
        setEditing(!editing);
    }

    const modalTitle = type === "vn" ? "Edit Favorite Visual Novels" : "Edit Favorite Characters";
    const modalDescription = type === "vn" ? "Select the visual novels you want to display on your profile." : "Select the characters you want to display on your profile.";

    return (
        <Dialog open={editing} onOpenChange={toggleEditing}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{modalTitle}</DialogTitle>
                    <DialogDescription>{modalDescription}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4" />
                        <Input
                            placeholder={type === "vn" ? "Search visual novels..." : "Search characters..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[200px]">
                        {searchResults.map((result: IVNBasic | ICharacterBasic, id: number) => (
                            <div key={id} className="flex items-center justify-between space-x-2 mb-2">
                                <div className="flex items-center gap-2">
                                    {('cover' in result) ? (
                                        <img
                                            src={result.cover.url} 
                                            alt={result.title}
                                            width={32}
                                        />
                                    ) : (
                                        <img
                                            src={result.image?.url!}
                                            alt={result.name} 
                                            width={32}
                                        />
                                    )}
                                    <label
                                        htmlFor={`${type}-${result.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                    >
                                        <span className="mr-2">
                                            {isIVNBasic(result) ? result.title : result.name}
                                        </span>
                                    </label>
                                </div>
                                <Checkbox
                                    id={`${type}-${result.id}`}
                                    checked={tempFavorites.some((fav: IVNBasic | ICharacterBasic) => fav.id === result.id)}
                                    onCheckedChange={() => handleToggle(result.id)}
                                />
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
