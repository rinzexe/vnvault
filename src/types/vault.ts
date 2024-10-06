import { IVN } from "./vn";

export interface IVNVaultEntry {
    vn: IVN
    rating: number
    status: IVaultStatus
    createdAt: string
    updatedAt: string
}

export interface IVNVault {
    entries: IVNVaultEntry[]
}

export enum IVaultStatus {
    Finished = "Finished",
    Reading = "Reading",
    ToRead = "Plan to read",
    Dropped = "Dropped",
}