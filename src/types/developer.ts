import { IVN } from "./vn"

export interface IDeveloper {
    id: number
    description: string
    name: string
    type: "co" | "in" | "ng"
    vns?: IVN[]
}