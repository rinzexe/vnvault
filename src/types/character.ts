import { IImage } from "./image"
import { IVN } from "./vn"


export interface ICharacterVN extends IVN {
    role: "main" | "primary" | "side" | "appears"
}

export interface ICharacter {
    id: number
    vns: ICharacterVN[]
    image?: any
    name: string
    description?: string
}

export interface ICharacterBasic {
    id: number
    image?: IImage
    name: string
}