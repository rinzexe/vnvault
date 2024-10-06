import { IVNTag } from "./vn-tag"

export interface IVNImage {
    url: string
    nsfw: boolean
    resolution: number[]
}

export interface IVN extends IVNBasic {
    description: string
    titles: string[]
    released: string
    rateCount: number
    length: number // in minutes
    screenshots: IVNImage[]
    devStatus: number
    developers: any[]
    tags: IVNTag[]
}

export interface IVNBasic {
    id: number
    title: string
    altTitle: string
    rating?: number
    cover: IVNImage
}

export interface IVNFilters {
    rating?: number[]
}

export interface IVNSort {
    asc: boolean
    type: "title" | "rating" | "releaseDate"
}