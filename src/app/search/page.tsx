'use client'

import { getRandomSuggestionPlaceholder } from "@/utils/placeholders"
import { useEffect, useState } from "react"
import Link from "next/link"
import RatingBadge from "../_components/rating-badge"
import Table from "../_components/table/table"
import Headers from "../_components/table/headers"
import Row from "../_components/table/row"
import AccentButton from "../_components/accent-button"
import { useAuth } from "../_components/auth-provider"
import { getEnglishTitle } from "@/utils/vn-data"
import { characterSearchByName, developerSearchByName, vnSearchByName } from "@/lib/vndb/search"
import { calculateLevel } from "@/utils/levels"

export default function Search() {
    const [searchQuery, setSearchQuery] = useState<any>(" ")
    const [searchResults, setSearchResults] = useState<any>()
    const [sorting, setSorting] = useState({ type: "rating", asc: false })
    const [type, setType] = useState(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const auth = useAuth()

    useEffect(() => {
        setIsLoading(true)
        async function search() {
            if (type == 0) {
                const results = await vnSearchByName(searchQuery.searchTerm, 50, sorting)
                setSearchResults(results)
            }
            else if (type == 1) {
                const results = await auth.searchUsers(searchQuery.searchTerm)
                setSearchResults(results)
            }
            else if (type == 2) {
                const results = await characterSearchByName(searchQuery.searchTerm, 50)
                setSearchResults(results)
            }
            else if (type == 3) {
                const results = await developerSearchByName(searchQuery.searchTerm, 50)
                setSearchResults(results)
            }
            setIsLoading(false)
        }

        if (searchQuery) {
            search()
        }
    }, [searchQuery, sorting, type])


    function ratingSort() {
        setSorting({ type: "rating", asc: !sorting.asc })
    }

    function titleSort() {
        setSorting({ type: "title", asc: !sorting.asc })
    }

    return (
        <div className="flex flex-col items-center]">
            <div className="flex flex-col gap-4 items-center">
                <h1>Search</h1>
                <form className="flex gap-4 mb-4 flex-col items-center lg:flex-row max-w-[85vw] w-[40rem]" action={(e) => setSearchQuery({ searchTerm: e.get('searchTerm') })}>
                    <input name="searchTerm" placeholder={getRandomSuggestionPlaceholder()} className="panel px-4 max-w-full w-[30rem] py-2 focus:outline-none flex-grow" type="text" />
                    <button type="submit" className="panel px-4 py-2 focus:outline-none lg:w-fit max-w-full w-[30rem]">Search</button>
                </form>
                <div className=" block *:m-1 *:inline-block w-[60rem] max-w-[85vw]">
                    <AccentButton className={type == 0 && "bg-white/10"} onClick={() => { setIsLoading(true); setType(0) }}>Visual novels</AccentButton>
                    <AccentButton className={type == 1 && "bg-white/10"} onClick={() => { setIsLoading(true); setType(1) }}>Users</AccentButton>
                    <AccentButton className={type == 2 && "bg-white/10"} onClick={() => { setIsLoading(true); setType(2) }}>Characters</AccentButton>
                    <AccentButton className={type == 3 && "bg-white/10"} onClick={() => { setIsLoading(true); setType(3) }}>Developers</AccentButton>
                </div>
                {searchResults && searchResults.length > 0 && isLoading == false ? (
                    type == 0 ? (
                        <VNTable titleSort={titleSort} ratingSort={ratingSort} searchResults={searchResults} sorting={sorting} />
                    ) : (
                        type == 1 ? (
                            <UserTable sorting={sorting} titleSort={titleSort} searchResults={searchResults} />
                        ) : (
                            type == 2 ? (
                                <CharacterTable titleSort={titleSort} searchResults={searchResults} sorting={sorting} />
                            ) : (
                                <DeveloperTable titleSort={titleSort} searchResults={searchResults} sorting={sorting} />
                            )
                        )
                    )
                ) : (
                    isLoading ? (
                        <></>
                    ) : (
                        <div>
                            <p>No results :(</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

function VNTable({ searchResults, sorting, titleSort, ratingSort }: any) {
    return (
        <Table>
            <Headers
                sort={{
                    type:
                        sorting.type == "rating" ? 3 : 0
                    , asc: sorting.asc
                }}
                fields={['Length', 'Released', 'Rating']}
                sortingCallback={[titleSort, , , ratingSort]} />
            {searchResults.map((result: any, id: number) => {
                return (
                    <Row
                        hasIcon={true}
                        key={id}
                        href={"/novel/" + result.id}
                        iconUrl={result.image && result.image.thumbnail}
                        fields={[(
                            <div key={id} className="*:text-center">
                                {result.length == "1" && (
                                    <p>Very short</p>
                                )}
                                {result.length == "2" && (
                                    <p>Short</p>
                                )}
                                {result.length == "3" && (
                                    <p>Average</p>
                                )}
                                {result.length == "4" && (
                                    <p>Long</p>
                                )}
                                {result.length == "5" && (
                                    <p>Very long</p>
                                )}
                            </div>
                        ), (
                            <p>{result.released}</p>
                        ), (
                            <RatingBadge key={id} rating={result.rating / 10} />)

                        ]}
                        title={getEnglishTitle(result)}
                        subtitle={result.alttitle}
                    />
                )
            })}
        </Table>
    )
}

function UserTable({ searchResults, titleSort, sorting }: any) {
    return (
        <Table>
            <Headers
                sort={{
                    type: 0,
                    asc: sorting.asc
                }}
                fields={['Level']}
                sortingCallback={[titleSort]}
                leftPadding={12} />
            {searchResults.map((result: any, id: number) => {
                return (
                    <Row
                        hasIcon={true}
                        key={id}
                        href={"/profile/" + result.username}
                        avatarUser={result}
                        fields={[<h3 key={id} className="pr-[12px] text-white">{calculateLevel(result.xp).level}</h3>]}
                        title={result.username}
                        subtitle={result.alttitle}
                    />
                )
            })}
        </Table>
    )

}

function CharacterTable({ searchResults, titleSort, sorting }: any) {

    return (
        <Table>
            <Headers
                sort={{
                    type: 0,
                    asc: sorting.asc
                }}
                fields={[]}
                sortingCallback={[titleSort]} />
            {searchResults.map((result: any, id: number) => {
                return (
                    <Row
                        hasIcon={true}
                        key={id}
                        href={"/character/" + result.id}
                        iconUrl={result.image && result.image.url}
                        fields={[]}
                        title={result.name}
                    />
                )
            })}
        </Table>
    )
}

function DeveloperTable({ searchResults }: any) {

    return (
        <Table>
            <Headers fields={[]} />
            {searchResults.map((result: any, id: number) => {
                return (
                    <Row
                        key={id}
                        href={"/producer/" + result.id}
                        fields={[]}
                        title={result.name}
                    />
                )
            })}
        </Table>
    )
}