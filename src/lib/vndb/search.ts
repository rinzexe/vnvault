import { IVN, IVNBasic, IVNFilters } from "@/types/vn";
import { parseVn, parseCharacter, request, IRequestParams, parseDeveloper } from "./utils";
import { ICharacter, ICharacterBasic } from "@/types/character";
import { IVNSort } from "@/types/vn";
import { IDeveloper } from "@/types/developer";

export async function getVnById(id: number): Promise<IVN>;
export async function getVnById(id: number[]): Promise<IVN[]>;

export async function getVnById(id: number | number[]): Promise<IVN | IVN[]> {
    if (Array.isArray(id)) {
        let filters: any = ["or"]

        id.forEach((currentId: number) => {
            filters.push(["id", "=", "v" + currentId.toString()])
        })

        const res: any = await request({ endpoint: "vn", filters: filters })

        return parseVn(res.results)
    }
    else {
        const res: any = await request({ endpoint: "vn", filters: ["id", "=", "v" + id.toString()] })

        return parseVn(res.results)[0]
    }
}

export async function getCharactersByVnId(id: number | number[]) {
    if (Array.isArray(id)) {
        let filters: any = ["or"]

        id.forEach((currentId: number) => {
            filters.push(['vn', '=', ['id', '=', "v" + currentId.toString()]])
        })


        const res: any = await request({ endpoint: "character", filters: filters })

        return parseCharacter(res.results) as ICharacter[]
    }
    else {
        const filters = ['vn', '=', ['id', '=', "v" + id.toString()]]

        const res: any = await request({ endpoint: "character", filters: filters })

        let parsedCharacters = parseCharacter(res.results)

        const roleOrder: any = {
            main: 1,
            primary: 2,
            side: 3,
            appears: 4,
        };

        parsedCharacters = parsedCharacters.sort((a, b) => {
            return roleOrder[a.vns.find((vn) => vn.id == id)?.role!] - roleOrder[b.vns.find((vn) => vn.id == id)?.role!];
        });

        return parsedCharacters
    }
}

export async function getCharacterById(id: number): Promise<ICharacter>;
export async function getCharacterById(id: number[]): Promise<ICharacter[]>;
export async function getCharacterById(id: number | number[]): Promise<ICharacter | ICharacter[]> {
    if (Array.isArray(id)) {
        let filters: any = ["or"]

        id.forEach((currentId: number) => {
            filters.push(['id', '=', currentId.toString()])
        })

        const res: any = await request({ endpoint: "character", filters: filters })

        return parseCharacter(res.results) as ICharacter[]
    }
    else {
        const filters = ['id', '=', id.toString()]

        const res: any = await request({ endpoint: "character", filters: filters })

        return parseCharacter(res.results)[0]
    }
}

export async function getVnBySearch(query: string, filters?: IVNFilters, sort?: IVNSort): Promise<IVN[]> {
    let requestData: IRequestParams = { endpoint: "vn", filters: ["and", ["search", "=", query]] }


    if (filters) {
        if (filters.rating) {
            requestData.filters?.push(["rating", ">=", filters.rating[0] * 10])
            requestData.filters?.push(["rating", "<=", filters.rating[1] * 10])
        }
    }


    if (sort) {
        requestData.sort = sort
    }

    const res: any = await request(requestData)

    return parseVn(res.results)
}

export async function getCharacterBySearch(query: string): Promise<ICharacterBasic[]> {
    let requestData: IRequestParams = { endpoint: "character", filters: ["and", ["search", "=", query]] }

    const res: any = await request(requestData)

    return parseCharacter(res.results)
}

export async function getDeveloperBySearch(query: string): Promise<IDeveloper[]> {
    let requestData: IRequestParams = { endpoint: "producer", filters: ["and", ["search", "=", query]] }

    const res: any = await request(requestData)

    return parseDeveloper(res.results)
}

export async function getDeveloperById(id: number): Promise<IDeveloper> {
    let requestData: IRequestParams = { endpoint: "producer", filters: ["and", ["id", "=", "p" + id]] }

    const res: any = await request(requestData)

    return parseDeveloper(res.results)[0]
}

export async function getVnByDeveloperId(id: number) {

    const filters = ['developer', '=', ['id', '=', "p" + id]]

    const res: any = await request({ endpoint: "vn", filters: filters })

    return parseVn(res.results)

}