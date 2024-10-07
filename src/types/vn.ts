import { IDeveloper } from "./developer"
import { IImage } from "./image"
import { IVNTag } from "./vn-tag"

export interface IVN extends IVNBasic {
    description: string
    titles: string[]
    released: string
    rateCount: number
    length: number // in minutes
    screenshots: IImage[]
    devStatus: number
    developers: IDeveloper[]
    tags: IVNTag[]
    olang: string
    languages: string[]
}

export interface IVNBasic {
    id: number
    title: string
    altTitle: string
    rating?: number
    cover: IImage
}

export interface IVNFilters {
    rating?: number[]
}

export interface IVNSort {
    asc: boolean
    type: "title" | "rating" | "releaseDate"
}