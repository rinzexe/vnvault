import { IVNSort } from "@/types/vn"
import { fieldPresets } from "./field-presets"
import { IVN } from "@/types/vn"
import { ICharacter } from "@/types/character"

export interface IRequestParams {
    filters?: any[]
    endpoint: "vn" | "producer" | "character" | "tag"
    resultCount?: number
    sort?: IVNSort
    page?: number
}

export async function request(params: IRequestParams) {

    var body: any = {
        'fields': fieldPresets[params.endpoint],
        "count": true,
        "results": 100
    }

    if (params.filters) {
        body['filters'] = params.filters
    }
    if (params.sort) {
        body['sort'] = params.sort.type
        body['reverse'] = !params.sort.asc
    }
    if (params.page) {
        body['page'] = params.page
    }

    const res = await await fetch('https://api.vndb.org/kana/' + params.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const jsonRes = await res.json()

    return jsonRes
}

export function parseVn(jsonRes: any) {
    var parsedResults: IVN[] = []

    jsonRes.results.forEach((result: any) => {
        const parsedResult: IVN = {
            id: parseInt(result.id.substring(1)),
            title: getEnglishTitle(result),
            altTitle: result.alttitle,
            description: result.description,
            titles: result.titles,
            released: result.released,
            rating: parseFloat((result.rating / 10).toFixed(1)),
            rateCount: result.votecount,
            length: result.length_minutes,
            screenshots: result.screenshots,
            cover: result.image,
            devStatus: result.devstatus,
            developers: result.developers,
            tags: result.tags
        }

        parsedResults.push(parsedResult)
    })

    return parsedResults
}

export function parseCharacter(jsonRes: any) {
    var parsedResults: ICharacter[] = []

    jsonRes.results.forEach((result: any) => {
        const parsedResult: ICharacter = {
            id: parseInt(result.id.substring(1)),
            vns: result.vns,
            image: result.image,
            name: result.name,
            description: result.description
        }

        parsedResults.push(parsedResult)
    })

    return parsedResults
}

function getEnglishTitle(jsonRes: any) {
    const englishTitle = jsonRes.titles.find((title: any) => title.lang == "en")

    var mainTitle = jsonRes.title

    if (englishTitle) {
        mainTitle = englishTitle.title
    }

    return mainTitle
}

export function formatDescription(text: string) {

    text = text.replaceAll("[From", "^")
    text = text.replaceAll("[Edited from", "^")
    text = text.replaceAll("[Translated from", "^")

    text = text.replace("]]", "^")
    text = text.replaceAll(/\^([^\^]+)\^/g, '');

    text = text.replaceAll("[spoiler]", "")
    text = text.replaceAll("[/spoiler]", "")

    text = text.replaceAll("[b]", "")
    text = text.replaceAll("[/b]", "")

    text = text.replaceAll("<s>", "")
    text = text.replaceAll("</s>", "")
    text = text.replaceAll(/\^([^\^]+)\^/g, '');

    text = text.replaceAll("[/url]", "")

    text = text.replaceAll("[url=/", "^")
    text = text.replaceAll("]", "^")
    text = text.replaceAll(/\^([^\^]+)\^/g, '');


    text = text.replaceAll('^', "")
    return text;
}
