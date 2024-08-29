import AccentButton from "@/app/_components/accent-button"
import { useAuth } from "@/app/_components/auth-provider"
import MinusSVG from "@/app/_components/svgs/minus"
import PlusSVG from "@/app/_components/svgs/plus"
import TrashSVG from "@/app/_components/svgs/trash"
import Headers from "@/app/_components/table/headers"
import Row from "@/app/_components/table/table-entry"
import Table from "@/app/_components/table/table"
import { characterSearchByName, vnSearchByName } from "@/lib/vndb/search"
import { getRandomSuggestionPlaceholder } from "@/utils/placeholders"
import { getEnglishTitle } from "@/utils/vn-data"
import { useEffect, useState } from "react"

export default function FavoriteEditingModal({ type, favorites }: any) {
    const [searchQuery, setSearchQuery] = useState<any>(" ")
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchResults, setSearchResults] = useState<any>()
    const [tempFavorites, setTempFavorites] = useState<any>()

    const auth = useAuth()

    useEffect(() => {
        setIsLoading(true)

        async function search() {

            if (type == 0) {
                const results = await vnSearchByName(searchQuery.searchTerm, 50)
                setSearchResults(results)
            }
            else if (type == 1) {
                const results = await characterSearchByName(searchQuery.searchTerm, 50)
                setSearchResults(results)
            }
            setIsLoading(false)
        }

        if (searchQuery) {
            search()
        }
    }, [searchQuery, type])

    useEffect(() => {
        setTempFavorites(favorites)
        if (!favorites) {
            setTempFavorites([])
        }
    }, [favorites])

    function updateFavorites(newFav: any, addition: boolean) {
        if (type == 0) {
            if (!tempFavorites.some((fav: any) => fav.title == newFav.title) || addition == false) {
                var newFavs = [...tempFavorites, newFav].slice(0, 3)

                if (addition == false) {
                    newFavs = tempFavorites.filter((fav: any) => fav.title != newFav.title)
                }

                var favs: string[] = []
                newFavs.forEach((fav: any) => {
                    favs.push(fav.id)
                });
                auth.updateUser(auth.user.id, { favorite_novels: favs })

                setTempFavorites(newFavs);
            }
        }
        else {
            if (!tempFavorites.some((fav: any) => fav.name == newFav.name) || addition == false) {
                var newFavs = [...tempFavorites, newFav].slice(0, 3)

                if (addition == false) {
                    newFavs = tempFavorites.filter((fav: any) => fav.name != newFav.name)
                }

                var favs: string[] = []
                newFavs.forEach((fav: any) => {
                    favs.push(fav.id)
                });
                auth.updateUser(auth.user.id, { favorite_characters: favs })

                setTempFavorites(newFavs);
            }
        }
    }

    return (
        <div className="max-w-[1000px] h-[50rem] w-full panel flex flex-col items-center">
            <form className="flex gap-4 mb-4 flex-col items-center lg:flex-row max-w-[85vw] w-[40rem]" action={(e) => setSearchQuery({ searchTerm: e.get('searchTerm') })}>
                <input name="searchTerm" placeholder={getRandomSuggestionPlaceholder()} className="panel px-4 max-w-full w-[30rem] py-2 focus:outline-none flex-grow" type="text" />
                <button type="submit" className="panel px-4 py-2 focus:outline-none lg:w-fit max-w-full w-[30rem]">Search</button>
            </form>
            <div className="grid w-full flex-grow flex-shrink min-h-0 gap-8 grid-rows-2">
                <div className="w-full overflow-y-auto">
                    <Table
                        acceptedTypes={{ row: true, card: false }}
                        isLoading={isLoading}
                        headers={{
                            fields: [''],
                            leftPadding: 180
                        }}
                        entries={
                            searchResults && searchResults.map((result: any, id: number) => {
                                if (type == 0) {
                                    return {
                                        hasIcon: true,
                                        href: "/",
                                        key: id,
                                        iconUrl: result.image && result.image.thumbnail,
                                        dims: result.image && result.image.thumbnail_dims,
                                        fields: [],
                                        title: getEnglishTitle(result),
                                        actionContent: (
                                            <div onClick={() =>
                                                updateFavorites(result, !tempFavorites.some((fav: any) => fav.title == result.title))
                                            }
                                                className="group w-fit hidden lg:flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10">
                                                <h4 className="duration-300 group-hover:text-blue-500 group-hover:font-bold">
                                                    {tempFavorites.some((fav: any) => fav.title == result.title) ? "Remove" : "Add"}
                                                </h4>
                                                {tempFavorites.some((fav: any) => fav.title == result.title) ? (
                                                    <MinusSVG className="w-12 h-10 stroke-white fill-white group-hover:fill-blue-500 stroke-1 group-hover:stroke-2  group-hover:stroke-blue-500 duration-300" />
                                                ) : (
                                                    <PlusSVG className="w-12 h-10 stroke-white fill-white group-hover:fill-blue-500 stroke-1 group-hover:stroke-2  group-hover:stroke-blue-500 duration-300" />
                                                )}
                                            </div>
                                        )
                                    }
                                }
                                else {
                                    return {
                                        hasIcon: true,
                                        key: id,
                                        iconUrl: result.image && result.image.url,
                                        dims: result.image && result.image.dims,
                                        fields: [],
                                        title: result.name,
                                        actionContent: (
                                            <div onClick={() =>
                                                updateFavorites(result, !tempFavorites.some((fav: any) => fav.name == result.name))
                                            }
                                                className="group w-fit hidden lg:flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10">
                                                <h4 className="duration-300 group-hover:text-blue-500 group-hover:font-bold">
                                                    {tempFavorites.some((fav: any) => fav.name == result.name) ? "Remove" : "Add"}
                                                </h4>
                                                {tempFavorites.some((fav: any) => fav.name == result.name) ? (
                                                    <MinusSVG className="w-12 h-10 stroke-white fill-white group-hover:fill-blue-500 stroke-1 group-hover:stroke-2  group-hover:stroke-blue-500 duration-300" />
                                                ) : (
                                                    <PlusSVG className="w-12 h-10 stroke-white fill-white group-hover:fill-blue-500 stroke-1 group-hover:stroke-2  group-hover:stroke-blue-500 duration-300" />
                                                )}
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    />
                </div>
                {tempFavorites && (
                    <div className="w-full gap-4 grid grid-cols-3 ">
                        <div className="h-full w-full relative panel p-8 ">
                            {tempFavorites[0] ?
                                <SelectedEntry type={type} updateFavorites={updateFavorites} favorites={tempFavorites} iconUrl={tempFavorites[0].image?.url} title={type == 0 ? tempFavorites[0].title : tempFavorites[0].name} /> : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <p>
                                            No favorite set
                                        </p>
                                    </div>
                                )}
                        </div>
                        <div className="h-full w-full relative panel p-8">
                            {tempFavorites[1] ? <SelectedEntry type={type} updateFavorites={updateFavorites} favorites={tempFavorites} iconUrl={tempFavorites[1].image?.url} title={type == 0 ? tempFavorites[1].title : tempFavorites[1].name} /> : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <p>
                                        No favorite set
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="h-full w-full relative panel p-8">
                            {tempFavorites[2] ? <SelectedEntry type={type} updateFavorites={updateFavorites} favorites={tempFavorites} iconUrl={tempFavorites[2].image?.url} title={type == 0 ? tempFavorites[2].title : tempFavorites[2].name} /> : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <p>
                                        No favorite set
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function SelectedEntry({ iconUrl, title, favorites, updateFavorites, type }: any) {
    function removeEntry() {
        var favToRemove = favorites.filter((fav: any) => fav.title == title)
        if (type == 1) {
            favToRemove = favorites.filter((fav: any) => fav.name == title)
        }

        updateFavorites(favToRemove[0], false)
    }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-full h-full flex justify-center">
                <div className=" w-full h-full relative">
                    <button onClick={removeEntry} className="absolute z-10 -right-6 hover:bg-white/10 duration-300 -top-6 h-9 p-0 w-9 panel flex justify-center items-center ">
                        <TrashSVG className=" stroke-red-500 w-6 h-6" />
                    </button>
                    <div className="absolute w-full h-full top-0 left-0 rounded-xl ">
                        <img className="object-contain w-auto h-auto mx-auto max-w-full max-h-full rounded-xl" src={iconUrl!} alt={title} />
                    </div>
                </div>
            </div>
            <h2 className="text-center mt-2">
                {title}
            </h2>
        </div>
    )
}