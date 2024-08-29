import { idSearch, infiniteSearch } from "./utils"

export interface IFilter {
    name: string
    operator: string
    value: string
}

export interface IFilters {
    nsfw?: IFilter
    genre?: IFilter
    minRating?: IFilter
    maxRating?: IFilter
    minVotecount?: IFilter
    maxVorecount?: IFilter
    minReleased?: IFilter
    maxReleased?: IFilter
}

export async function vnSearchByIdList(search: string[], sort?: { type: string, asc: boolean }) {
    const res = await idSearch(search,
        'vn',
        'id, title, rating, titles.title, votecount, titles.lang, released, length, description, alttitle, image.url, image.thumbnail, image.dims, image.thumbnail_dims, length_minutes, tags.id, tags.name, tags.category',
        sort!
    )

    return res
}

export async function vnSearchByDeveloper(devId: string | string[], sort?: { type: string, asc: boolean }) {
    var finalFilter: any = ['or']

    if (devId.constructor == Array) {
        devId.forEach((id: string) => {
            finalFilter.push(['developer', '=', ['id', '=', id]])
        })
    }
    else {
        finalFilter.push(['developer', '=', ['id', '=', devId]])
    }

    const res = await infiniteSearch(
        finalFilter,
        'vn',
        'id, title, titles.title, titles.lang, rating, released, developers.id, length, description, alttitle, image.url, image.dims, image.thumbnail, image.thumbnail_dims',
        9999,
        sort ? sort : { type: 'title', asc: false }
    )

    return res
}

export async function vnSearchByName(search: string, results: number, sort?: { type: string, asc: boolean }, filters?: IFilters) {

    var finalFilter: any = ['and']
    finalFilter.push(['search', '=', search])

    if (filters) {
        var filterArray = Object.values(filters)
        filterArray.forEach((filter: any) => {
            const varToPush = [filter.name, filter.operator, filter.value]
            finalFilter.push(varToPush)
        })
    }

    const res = await infiniteSearch(
        finalFilter,
        'vn',
        'id, title, titles.title, titles.lang, image.thumbnail, image.thumbnail_dims, released, rating, length, description, alttitle, image.url',
        results,
        sort ? sort : { type: 'rating', asc: false }
    )

    return res
}

export async function getVnDataById(id: string) {
    const res: any = await idSearch([id],
        'vn',
        'id, title, titles.title, titles.lang, rating, released, votecount, length, description, alttitle, image.url, image.dims, tags.name, tags.category, tags.description, developers.id, developers.name, developers.original, languages, length_minutes, devstatus, olang, screenshots.sexual, screenshots.url'
    )

    return res[0]
}

export async function characterSearchByName(search: string, results: number) {
    const res = await infiniteSearch(
        ['search', '=', search],
        'character',
        'id, name, vns.title, image.url, image.dims',
        results,
        { type: 'name', asc: false }
    )

    return res
}

export async function characterSearchByIdList(search: string[]) {
    const res: any = await idSearch(search,
        'character',
        'id, name, vns.title, description, original, image.url, image.dims, height, weight, bust, waist, hips, cup, age, birthday, vns.id, vns.image.url, vns.image.thumbnail, vns.image.thumbnail_dims, vns.rating, vns.role',
        { type: 'name', asc: false }
    )

    return res
}

export async function characterSearchByVnId(id: string) {
    const res = await infiniteSearch(
        ['vn', '=', ['id', '=', id]],
        'character',
        'id, name, vns.title, description, original, image.url, image.dims, height, weight, bust, waist, hips, cup, age, birthday, vns.id, vns.image.url, vns.role',
        9999,
        { type: 'name', asc: false }
    )

    return res
}

export async function developerSearchByName(search: string, results: number) {
    const res = await infiniteSearch(
        ['search', '=', search],
        'producer',
        'id, name, original, type',
        results,
        { type: 'name', asc: false }
    )

    return res
}

export async function developerSearchByIdList(search: string[]) {
    const res: any = await idSearch(
        search,
        'producer',
        'id, name, original, type, description',
        { type: 'name', asc: false }
    )

    return res
}

// FIX THIS PLEASE
export async function getRecentVnReleases() {
    const today = new Date()
    console.log(today)
    const res: any = await infiniteSearch(
        ['released', '<=', '2024-08-24'],
        'vn',
        'id, title, titles.title, titles.lang, image.thumbnail, released, rating, length, description, alttitle, image.url',
        4,
        { type: 'released', asc: false }
    )

    return res
}