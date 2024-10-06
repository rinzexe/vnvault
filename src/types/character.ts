import { IVN } from "./vn"

export interface ICharacter {
    id: number
    vns: IVN[]
    image?: any
    name: string
    description?: string
}

export interface ICharacterBasic {
    id: number
    image?: any
    name: string
}