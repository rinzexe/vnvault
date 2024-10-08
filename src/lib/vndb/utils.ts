import { IVNSort } from "@/types/vn"
import { fieldPresets } from "./field-presets"
import { IVN } from "@/types/vn"
import { ICharacter, ICharacterVN } from "@/types/character"
import { IDeveloper } from "@/types/developer"
import { getVnByDeveloperId } from "./search"
import { toast } from "@/hooks/use-toast"

export interface IRequestParams {
    filters?: any[]
    endpoint: "vn" | "producer" | "character" | "tag"
    resultCount?: number
    sort?: IVNSort
    page?: number
}

export async function request(params: IRequestParams) {
    console.log(params)
    let body: any = {
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

    try {
        const res = await fetch('https://api.vndb.org/kana/' + params.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const jsonRes = await res.json();
        return jsonRes;
    } catch (error) {
        console.error('Error during request:', error);
        toast({
            title: "Request Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
            variant: "destructive", // Adjust the variant as needed
        });
        throw error; // Optionally rethrow the error if you want to handle it further up the call stack
    }
}

export function parseVn(jsonRes: any) {
    let parsedResults: IVN[] = []

    jsonRes.forEach((result: any) => {
        const parsedResult: IVN = {
            id: parseInt(result.id.substring(1)),
            title: getEnglishTitle(result),
            altTitle: result.alttitle,
            description: parseDescription(result.description),
            titles: result.titles?.map((title: any) => title.title)!,
            released: result.released,
            rating: parseFloat((result.rating / 10).toFixed(2)),
            rateCount: result.votecount,
            length: result.length_minutes,
            screenshots: result?.screenshots?.map((screenshot: any) => { return { url: screenshot.url, resolution: screenshot.dims, nsfw: screenshot.sexual > 1 } }),
            cover: { url: result.image.url, resolution: result.image.dims, nsfw: result.image.sexual > 1 },
            devStatus: result.devstatus,
            developers: result.developers,
            tags: result?.tags?.map((tag: any) => { return { name: tag.name, category: tag.category, rating: tag.rating, spoiler: tag.spoiler } })!,
            olang: result.olang,
            languages: result.languages
        }

        parsedResults.push(parsedResult)
    })

    return parsedResults
}

export function parseCharacter(jsonRes: any) {
    let parsedResults: ICharacter[] = []

    jsonRes.forEach((result: any) => {
        const parsedResult: ICharacter = {
            id: parseInt(result.id.substring(1)),
            vns: result.vns.map((vn: any, id: number) => ({ ...parseVn([vn])[0], role: result.vns[id].role })),
            image: { url: result.image?.url, resolution: result.image?.dims, nsfw: result.image?.sexual > 1 }!,
            name: result.name,
            description: parseDescription(result.description)
        }

        parsedResults.push(parsedResult)
    })

    return parsedResults
}

export function parseDeveloper(jsonRes: any) {
    let parsedResults: IDeveloper[] = []

    jsonRes.forEach((result: any) => {
        const parsedResult: IDeveloper = {
            id: parseInt(result.id.substring(1)),
            name: result.name,
            description: parseDescription(result.description),
            type: result.type
        }

        parsedResults.push(parsedResult)
    })

    return parsedResults
}

function getEnglishTitle(jsonRes: any) {
    const englishTitle = jsonRes.titles.find((title: any) => title.lang == "en")

    let mainTitle = jsonRes.title

    if (englishTitle) {
        mainTitle = englishTitle.title
    }

    return mainTitle
}

export function parseCharacterRole(role: string) {
    switch (role) {
        case "main": return "Main character"
        case "primary": return "Primary character"
        case "side": return "Side character"
        case "appears": return "Appears"
        default: return "Role unknown"
    }
}

function parseDescription(input: string): string {
    if (input) {
        let cleanedText = input.replace(/\[b\](.*?)\[\/b\]/gi, '$1');

        // Handle URL tags: Replace [url=...]...[/url] with the link text
        cleanedText = cleanedText.replace(/\[url=[^\]]*\](.*?)\[\/url\]/gi, '$1');
      
        // Handle generic tags like [From ...] by removing any brackets and keeping the text inside
        cleanedText = cleanedText.replace(/\[\s*From\s+([^\]]+)\s*\]/gi, 'From $1');
      
        // Remove any remaining unhandled brackets
        cleanedText = cleanedText.replace(/\[\s*|\s*\]/g, '');
      
        return input
    }
    else {
        return ""
    }
}

