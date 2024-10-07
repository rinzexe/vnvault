import { ICharacterBasic } from "./character"
import { IVaultStatus, IVNVault } from "./vault"
import { IVN, IVNBasic } from "./vn"

export interface IRecentActivityEntry {
    vn: IVNBasic
    status: IVaultStatus
    rating?: number
    date: string
}

export interface IUserProfile {
    uuid: string
    username: string
    joinedOn: string
    avatarUrl: string
    bio: string
    favoriteVisualNovels?: IVNBasic[]
    favoriteCharacters?: ICharacterBasic[]
    stats?: IUserStats
    vault?: IVNVault
}

export interface IUserStats {
    totalVnsFinished: number
    totalVnsReading: number
    totalVnsToRead: number
    totalVnsDropped: number
    totalVnsInList: number
    totalMinutesRead: number

    ratingDistribution: number[],
    averageRating: number
    ratedVns: number
    averageVotecount: number
    averageRatingPlayed: number
    favoriteTags: number[]
    recentActivity: IRecentActivityEntry[]
}