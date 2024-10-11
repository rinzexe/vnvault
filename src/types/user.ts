import { ICharacterBasic } from "./character"
import { IVaultStatus, IVNVault } from "./vault"
import { IVN, IVNBasic } from "./vn"

export interface IUser {
    uuid: string
    username: string
    joinedOn: string
    avatarUrl: string
    bannerUrl: string
    bio: string
    favoriteVisualNovels?: IVNBasic[]
    favoriteCharacters?: ICharacterBasic[]
    nsfwEnabled: boolean
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
}

export interface IUserSettings {
    nsfwEnabled: boolean
}