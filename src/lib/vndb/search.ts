import { idSearch, infiniteSearch } from "./utils"

export async function vnSearchByIdList(search: string[], sort?: { type: string, asc: boolean }) {
    const res = await idSearch(search,
        'vn',
        'id, title, rating, titles.title, titles.lang, released, length, description, alttitle, image.url, image.thumbnail, length_minutes, tags.id, tags.name, tags.category',
        sort!
    )

    return res
}

export async function vnSearchByDeveloper(devId: string, sort?: { type: string, asc: boolean }) {
    console.log(sort)
    const res = await infiniteSearch(
        ['developer', '=', ['id', '=', devId]],
        'vn',
        'id, title, titles.title, titles.lang, rating, released, length, description, alttitle, image.url',
        9999,
        sort ? sort : { type: 'title', asc: false }
    )

    return res
}

export async function vnSearchByName(search: string, results: number, sort?: { type: string, asc: boolean }) {

    const res = await infiniteSearch(
        ['search', '=', search],
        'vn',
        'id, title, titles.title, titles.lang, image.thumbnail, released, rating, length, description, alttitle, image.url',
        results,
        sort ? sort : { type: 'rating', asc: false }
    )
    console.log(res)

    return res
}

export async function getVnDataById(id: string) {
    const res: any = await idSearch([id],
        'vn',
        'id, title, titles.title, titles.lang, rating, released, votecount, length, description, alttitle, image.url, tags.name, tags.category, tags.description, developers.id, developers.name, developers.original, languages, length_minutes, devstatus, olang, screenshots.sexual, screenshots.url'
    )

    return res[0]
}

export async function characterSearchByName(search: string, results: number) {
    const res = await infiniteSearch(
        ['search', '=', search],
        'character',
        'id, name, vns.title, image.url',
        results,
        { type: 'name', asc: false }
    )

    return res
}

export async function characterSearchByIdList(search: string[]) {
    const res: any = await idSearch(search,
        'character',
        'id, name, vns.title, description, original, image.url, height, weight, bust, waist, hips, cup, age, birthday, vns.id, vns.title, vns.image.url, vns.role',
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
