import { IVNTag } from "./vn-tag"

export interface IVN extends IVNBasic {
    description: string
    titles: string[]
    released: string
    rateCount: number
    length: number // in minutes
    screenshots: any[]
    devStatus: number
    developers: any[]
    tags: IVNTag[]
}

export interface IVNBasic {
    id: number
    title: string
    altTitle: string
    rating?: number
    cover: any
}

export interface IVNFilters {
    rating?: number[]
}

export interface IVNSort {
    asc: boolean
    type: "title" | "rating" | "releaseDate"
}