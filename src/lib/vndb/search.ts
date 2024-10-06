import { IVN, IVNBasic, IVNFilters } from "@/types/vn";
import { parseVn, parseCharacter, request, IRequestParams } from "./utils";
import { ICharacter, ICharacterBasic } from "@/types/character";
import { IVNSort } from "@/types/vn";

export async function getVnById(id: number): Promise<IVN>;
export async function getVnById(id: number[]): Promise<IVN[]>;

export async function getVnById(id: number | number[]): Promise<IVN | IVN[]> {
    if (Array.isArray(id)) {
        let filters: any = ["or"]

        id.forEach((currentId: number) => {
            filters.push(["id", "=", "v" + currentId.toString()])
        })

        const res: any = await request({ endpoint: "vn", filters: filters })

        return parseVn(res)
    }
    else {
        const res: any = await request({ endpoint: "vn", filters: ["id", "=", "v" + id.toString()] })

        return parseVn(res)[0]
    }
}

export async function getCharactersByVnId(id: number | number[]) {
    if (Array.isArray(id)) {
        let filters: any = ["or"]

        id.forEach((currentId: number) => {
            filters.push(['vn', '=', ['id', '=', "v" + currentId.toString()]])
        })

        const res: any = await request({ endpoint: "character", filters: filters })

        return parseCharacter(res) as ICharacter[]
    }
    else {
        const filters = ['vn', '=', ['id', '=', "v" + id.toString()]]

        const res: any = await request({ endpoint: "character", filters: filters })

        return parseCharacter(res)
    }
}

export async function getCharactersById(id: number | number[]) {
    if (Array.isArray(id)) {
        let filters: any = ["or"]

        id.forEach((currentId: number) => {
            filters.push(['id', '=', currentId.toString()])
        })

        const res: any = await request({ endpoint: "character", filters: filters })

        return parseCharacter(res) as ICharacter[]
    }
    else {
        const filters = ['id', '=', id.toString()]

        const res: any = await request({ endpoint: "character", filters: filters })

        return parseCharacter(res)
    }
}

export async function getCharacterBySearch(query: string): Promise<ICharacterBasic[]> {
    const res: any = await request({ endpoint: "character", filters: ["search", "=", query] })

    return parseCharacter(res)
}

export async function getVnBySearch(query: string, filters?: IVNFilters, sort?: IVNSort): Promise<IVN[]> {
    let requestData: IRequestParams = { endpoint: "vn"}

    let parsedFilters: any[] = ["and", ["search", "=", query]]

    if (filters) {
        if (filters.rating) {
            parsedFilters.push(["rating", ">=", filters.rating[0] * 10])
            parsedFilters.push(["rating", "<=", filters.rating[1] * 10])
        }

        requestData.filters = parsedFilters
    }

    
    if (sort) {
        requestData.sort = sort
    }

    const res: any = await request(requestData)

    return parseVn(res)
}