'use client'

import { getRandomSuggestionPlaceholder } from "@/utils/placeholders"
import { useEffect, useState } from "react"
import Link from "next/link"
import RatingBadge from "../_components/rating-badge"
import Table from "../_components/table/table"
import Headers from "../_components/table/headers"
import Row from "../_components/table/row"
import { vnSearchByName } from "@/utils/vndb"

export default function Search() {
    const [searchQuery, setSearchQuery] = useState<any>(" ")
    const [searchResults, setSearchResults] = useState<any>()
    const [sorting, setSorting] = useState({ type: "rating", asc: false })

    useEffect(() => {
        async function search() {
            const results = await vnSearchByName(searchQuery.searchTerm, 50, sorting)
            setSearchResults(results)
        }

        if (searchQuery) {
            search()
        }
    }, [searchQuery, sorting])

    function ratingSort() {
        setSorting({ type: "rating", asc: !sorting.asc })
    }

    function titleSort() {
        setSorting({ type: "title", asc: !sorting.asc })
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-[60rem] flex flex-col gap-4 items-center">
                <h1>Search</h1>
                <form className="flex gap-4 mb-4 max-w-[95vw] w-[40rem]" action={(e) => setSearchQuery({ searchTerm: e.get('searchTerm') })}>
                    <input name="searchTerm" placeholder={getRandomSuggestionPlaceholder()} className="panel px-4 w-[30rem] py-2 focus:outline-none flex-grow" type="text" />
                    <button type="submit" className="panel px-4 py-2 focus:outline-none">Search</button>
                </form>
                {searchResults && searchResults.length > 0 ? (
                    <Table>
                        <Headers
                            sort={{ type: 
                                sorting.type == "rating" ? 2 : 0
                                , asc: sorting.asc }}
                            fields={['Length', 'Rating']}
                            sortingCallback={[titleSort, , ratingSort]} />
                        {searchResults.map((result: any, index: number) => {
                            return (
                                <Row
                                    href={"/novel/" + result.id}
                                    iconUrl={result.image && result.image.url}
                                    fields={[(
                                        <div className="*:text-center">
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
                                        <RatingBadge rating={result.rating / 10} />)

                                    ]}
                                    title={result.title}
                                    subtitle={result.alttitle}
                                />
                            )
                        })}
                    </Table>
                ) : (
                    <div>
                        <p>No results :(</p>
                    </div>
                )}
            </div>
        </div>
    )
}