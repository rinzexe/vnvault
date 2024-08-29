'use client'

import { getRandomSuggestionPlaceholder } from "@/utils/placeholders"
import { useEffect, useState } from "react"
import Link from "next/link"
import RatingBadge from "../_components/rating-badge"
import Table from "../_components/table/table"
import Headers from "../_components/table/headers"
import Row from "../_components/table/table-entry"
import AccentButton from "../_components/accent-button"
import { useAuth } from "../_components/auth-provider"
import { getEnglishTitle } from "@/utils/vn-data"
import { characterSearchByName, developerSearchByName, IFilters, vnSearchByDeveloper, vnSearchByName } from "@/lib/vndb/search"
import { calculateLevel } from "@/utils/levels"
import { getVnLengthName } from "@/utils/vn-length"
import Filters from "../_components/table/filters"
import ImageWithSkeleton from "../_components/image-with-skeleton"

export default function Search() {
    const [searchQuery, setSearchQuery] = useState<any>(" ")
    const [searchResults, setSearchResults] = useState<any>()
    const [sorting, setSorting] = useState({ type: "rating", asc: false })
    const [type, setType] = useState(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [filters, setFilters] = useState<IFilters>()

    const auth = useAuth()

    useEffect(() => {
        setIsLoading(true)
        setSearchResults([])
        async function search() {
            if (type == 0) {
                const results = await vnSearchByName(searchQuery.searchTerm, 50, sorting, filters)
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
                const results = await developerSearchByName(searchQuery.searchTerm, 20)
                console.log(results)
                setSearchResults(results)
            }
            setIsLoading(false)
        }
        if (searchQuery) {
            search()
        }
    }, [searchQuery, sorting, type, filters])

    function updateType(id: number) {
        setSearchResults([])
        setType(id)
    }

    function releasedSort() {
        setSorting({ type: "released", asc: !sorting.asc })
    }

    function ratingSort() {
        setSorting({ type: "rating", asc: !sorting.asc })
    }

    function titleSort() {
        setSorting({ type: "title", asc: !sorting.asc })
    }

    function nsfwFilter(id: number) {
        if (id == 0) {
            const newFilters = { ...filters }
            delete newFilters['nsfw']
            setFilters(newFilters)
        }
        else if (id == 1) {
            setFilters({ ...filters, nsfw: { name: "tag", operator: "!=", value: "g23" } })
        }
        else if (id == 2) {
            setFilters({ ...filters, nsfw: { name: "tag", operator: "=", value: "g23" } })
        }
    }

    function ratingFilter(values: number[]) {
        setFilters({ ...filters, minRating: { name: "rating", operator: ">=", value: Math.round((values[0]) * 10).toString() }, maxRating: { name: "rating", operator: "<=", value: Math.round((values[1]) * 10).toString() } })
    }

    return (
        <div className="flex flex-col items-center]">
            <div className="flex flex-col gap-4 items-center">
                <h1>Search</h1>
                <form className="flex gap-4 mb-4 flex-col items-center lg:flex-row max-w-[85vw] w-[40rem]" action={(e) => setSearchQuery({ searchTerm: e.get('searchTerm') })}>
                    <input name="searchTerm" placeholder={getRandomSuggestionPlaceholder()} className="panel px-4 max-w-full w-[30rem] py-2 focus:outline-none flex-grow" type="text" />
                    <button type="submit" className="panel px-4 py-2 focus:outline-none hidden lg:block lg:w-fit max-w-full w-[30rem]">Search</button>
                </form>
                <div className="flex gap-4  w-full">
                    <div className="w-full">
                        {true ? (
                            type == 0 ? (
                                <VNTable releasedSort={releasedSort} type={type} ratingFilter={ratingFilter} updateType={updateType} filters={filters} nsfwFilter={nsfwFilter} titleSort={titleSort} isLoading={isLoading} ratingSort={ratingSort} searchResults={searchResults} sorting={sorting} />
                            ) : (
                                type == 1 ? (
                                    <UserTable type={type} updateType={updateType} isLoading={isLoading} sorting={sorting} titleSort={titleSort} searchResults={searchResults} />
                                ) : (
                                    type == 2 ? (
                                        <CharacterTable type={type} updateType={updateType} isLoading={isLoading} titleSort={titleSort} searchResults={searchResults} sorting={sorting} />
                                    ) : (
                                        <DeveloperTable type={type} updateType={updateType} isLoading={isLoading} titleSort={titleSort} searchResults={searchResults} sorting={sorting} />
                                    )
                                )
                            )
                        ) : (
                            <div>
                                <p>No results :(</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function VNTable({ searchResults, releasedSort, sorting, filters, titleSort, ratingSort, type, updateType, nsfwFilter, ratingFilter, isLoading }: any) {

    return (
        <Table
            isLoading={isLoading}
            acceptedTypes={{ card: true, row: true }}
            filters={{
                filters: [
                    {
                        label: "Type",
                        dropdownSettings: {
                            labels: ['Visual Novels', 'Users', 'Characters'],
                            selected: type,
                        },
                        type: 'dropdown',
                        callback: updateType
                    },
                    {
                        label: "Content",
                        dropdownSettings: {
                            labels: ['SFW & NSFW', 'SFW', 'NSFW'],
                            selected: filters?.nsfw ?
                                filters.nsfw.operator == "=" ?
                                    2 : 1 : 0,
                        },
                        type: 'dropdown',
                        callback: nsfwFilter
                    },
                    {
                        label: "Rating",
                        type: 'range',
                        rangeSettings: {
                            valueLimits: [1, 10]
                        },
                        callback: ratingFilter
                    }]
            }}
            headers={{
                sort: {
                    type:
                        sorting.type == "rating" ? 3 :
                            sorting.type == "released" ? 2 : 0,
                    asc: sorting.asc
                },
                fields: ['Length', 'Released', 'Rating'],
                sortingCallback: [titleSort, , releasedSort, ratingSort]
            }}
            entries={
                searchResults && searchResults.map((result: any, id: number) => {
                    return {
                        cardFields: {
                            right: <RatingBadge className="mt-4" rating={result.rating / 10} />,
                            left:
                                (<div className="*:text-center">
                                    <p>
                                        {getVnLengthName(result.length)}
                                    </p>
                                </div>)
                        },
                        hasIcon: true,
                        href: "/novel/" + result.id,
                        dims: result.image && result.image.thumbnail_dims,
                        iconUrl: result.image && result.image.thumbnail,
                        fields: [(
                            <div key={id} className="*:text-center">
                                <p>
                                    {getVnLengthName(result.length)}
                                </p>
                            </div>
                        ), (
                            <p key={id}>{result.released}</p>
                        ), (
                            <RatingBadge key={id} rating={result.rating / 10} />
                        )],
                        title: getEnglishTitle(result),
                        subtitle: result.alttitle
                    }
                })
            }
        />
    )
}

function UserTable({ searchResults, titleSort, sorting, isLoading, type, updateType }: any) {
    return (
        <Table
            isLoading={isLoading}
            acceptedTypes={{ card: false, row: true }}
            filters={{
                filters: [
                    {
                        label: "Type",
                        dropdownSettings: {
                            labels: ['Visual Novels', 'Users', 'Characters'],
                            selected: type,
                        },
                        type: 'dropdown',
                        callback: updateType
                    },
                ]
            }}
            headers={{
                sort: {
                    type: 0,
                    asc: sorting.asc
                },
                fields: ['Level'],
                sortingCallback: [titleSort],
                leftPadding: 12
            }}
            entries={
                searchResults && searchResults.map((result: any, id: number) => {
                    return {
                        hasIcon: true,
                        key: id,
                        href: "/profile/" + result.username,
                        avatarUser: result,
                        fields: [<h3 key={id} className="pr-[12px] text-white">{calculateLevel(result.xp).level}</h3>],
                        title: result.username,
                        subtitle: result.alttitle
                    }
                })
            } />
    )

}

function CharacterTable({ searchResults, titleSort, sorting, isLoading, type, updateType }: any) {

    return (
        <Table
            isLoading={isLoading}
            acceptedTypes={{ card: true, row: true }}
            filters={{
                filters: [
                    {
                        label: "Type",
                        dropdownSettings: {
                            labels: ['Visual Novels', 'Users', 'Characters'],
                            selected: type,
                        },
                        type: 'dropdown',
                        callback: updateType
                    },
                ]
            }}
            headers={{
                sort: {
                    type: 0,
                    asc: sorting.asc
                },
                fields: [],
                sortingCallback: [titleSort],
            }}
            entries={
                searchResults && searchResults.map((result: any, id: number) => {
                    console.log(result)
                    return {
                        cardFields: {
                            right: <p className="text-right text-sm text-neutral-500">{result.vns[0].title}</p>,
                            left:
                                (<div>

                                </div>)
                        },
                        hasIcon: true,
                        key: id,
                        href: "/character/" + result.id,
                        iconUrl: result.image && result.image.url,
                        dims: result.image && result.image.dims,
                        fields: [],
                        title: result.name
                    }
                })
            } />
    )
}

function DeveloperTable({ searchResults, titleSort, sorting, isLoading, type, updateType }: any) {
    const [isLoadingVns, setIsLoadingVns] = useState<boolean>(true)
    const [vnData, setVnData] = useState<any>([])

    useEffect(() => {
        setIsLoadingVns(true)
        async function fetchVnData() {
            if (searchResults.length > 0) {
                const vnDataRes = await vnSearchByDeveloper(searchResults.map((result: any) => result.id))

                var vnDataArray: any = []
                searchResults.forEach((result: any) => {
                    var vnArray: any = []
                    vnDataRes.forEach((vnRes: any) => {
                        if (vnRes.developers.find((z: any) => z.id == result.id)) {
                            vnArray.push(vnRes)
                        }
                    });
                    vnDataArray.push(vnArray.slice(0, 3))
                });

                console.log(vnDataArray)
                setVnData(vnDataArray)
                setIsLoadingVns(false)
            }
        }
        console.log(searchResults)
        if (searchResults.length > 0) {
            fetchVnData()
        }

    }, [searchResults])

    return (
        <Table
            isLoading={isLoadingVns}
            acceptedTypes={{ card: false, row: true }}
            filters={{
                filters: [
                    {
                        label: "Type",
                        dropdownSettings: {
                            labels: ['Visual Novels', 'Users', 'Characters', 'Developers'],
                            selected: type,
                        },
                        type: 'dropdown',
                        callback: updateType
                    },
                ]
            }}
            headers={{
                sort: {
                    type: 0,
                    asc: sorting.asc
                },
                fields: ['Works'],
                sortingCallback: [titleSort],
            }}
            entries={
                searchResults.length > 0 ? searchResults.map((result: any, id: number) => {
                    return {
                        key: id,
                        href: "/producer/" + result.id,
                        fields: [!isLoadingVns &&
                            (
                                <div className="flex items-center gap-2">
                                    {vnData[id].map((data: any, index: number) => {
                                        return (
                                            <ImageWithSkeleton key={index} className="!w-14" allClassName="!rounded-md" dims={data.image.thumbnail_dims} src={data.image && data.image.thumbnail}></ImageWithSkeleton>
                                        )
                                    })}
                                </div>
                            )],
                        title: result.name
                    }
                }) : []
            } />
    )
}