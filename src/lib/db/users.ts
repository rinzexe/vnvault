import { IRecentActivityEntry, IUserProfile, IUserStats } from "@/types/user-profile"
import { IVN, IVNBasic } from "@/types/vn"
import { getCharactersById, getCharactersByVnId, getVnById } from "../vndb/search"
import { ICharacterBasic } from "@/types/character"
import { genreTags } from "@/consts/genre-tags"
import { IVaultStatus, IVNVault, IVNVaultEntry } from "@/types/vault"
import { SupabaseClient } from "@supabase/supabase-js"
import Database from "./db"

export class Users {
    supabase: SupabaseClient
    db: Database

    constructor(supabase: SupabaseClient, db: Database) {
        this.supabase = supabase
        this.db = db
    }

    async getUserStats(userId: string, vnData: IVN[]): Promise<IUserStats> {
        const res = await this.supabase.from('vault_entries').select('*').eq('owner_id', userId).order('updated_at', { ascending: false })
        const vaultEntries = res.data || []

        // setting up relevant data
        const finishedVaultEntries = vaultEntries.filter((entry: any) => entry.status == 0)
        const readingVaultEntries = vaultEntries.filter((entry: any) => entry.status == 1)
        const toReadVaultEntries = vaultEntries.filter((entry: any) => entry.status == 2)
        const droppedVaultEntries = vaultEntries.filter((entry: any) => entry.status == 3)
        const ratedVaultEntries = vaultEntries.filter((entry: any) => entry.rating != 0)
        const ratedEntries = vaultEntries.filter((entry: any) => entry.rating != 0)

        const finishedAndDroppedEntries = [...finishedVaultEntries, ...droppedVaultEntries]

        var finishedVnData: any = []
        var readingVnData: any = []
        var toReadVnData: any = []
        var droppedVnData: any = []
        var ratedVndata: any = []

        finishedVaultEntries.forEach((entry: any) => {
            const tempVnData = vnData.filter((vn: any) => vn.id == parseInt(entry.vid.substring(1)))
            finishedVnData.push(tempVnData[0])
        });
        readingVaultEntries.forEach((entry: any) => {
            const tempVnData = vnData.filter((vn: any) => vn.id == parseInt(entry.vid.substring(1)))
            readingVnData.push(tempVnData[0])
        });
        toReadVaultEntries.forEach((entry: any) => {
            const tempVnData = vnData.filter((vn: any) => vn.id == parseInt(entry.vid.substring(1)))
            toReadVnData.push(tempVnData[0])
        });
        droppedVaultEntries.forEach((entry: any) => {
            const tempVnData = vnData.filter((vn: any) => vn.id == parseInt(entry.vid.substring(1)))
            droppedVnData.push(tempVnData[0])
        });
        ratedVaultEntries.forEach((entry: any) => {
            const tempVnData = vnData.filter((vn: any) => vn.id == parseInt(entry.vid.substring(1)))
            ratedVndata.push(tempVnData[0])
        });

        // minutes to read
        var totalMinutesRead = 0

        finishedVnData.forEach((vn: any) => {
            totalMinutesRead += vn.length
        });

        // average popularity & rating
        var total = 0;
        for (var i = 0; i < ratedEntries.length; i++) {
            total += ratedEntries[i].rating;
        }
        var averageRating = total / ratedEntries.length;

        var averageVotecount = 0

        finishedAndDroppedEntries.forEach((entry: any, id: number) => {
            averageVotecount += vnData.find((data: any) => data.id == parseInt(entry.vid.substring(1)))?.rateCount ?? 0
        })

        averageVotecount /= finishedAndDroppedEntries.length
        averageVotecount = Math.round(averageVotecount)

        var averageRatingPlayed = 0

        finishedAndDroppedEntries.forEach((entry: any, id: number) => {
            averageRatingPlayed += vnData.find((data: any) => data.id == parseInt(entry.vid.substring(1)))?.rateCount ?? 0
        })

        averageRatingPlayed /= finishedAndDroppedEntries.length
        averageRatingPlayed = Math.round(averageRatingPlayed)

        // genre stats
        var favoriteTags: any = {}

        finishedVnData.forEach((vn: any) => {
            vn.tags.forEach((tag: any) => {
                if (tag.category == 'cont') {
                    if (genreTags.some((tagName: string) => tagName == tag.name)) {
                        if (favoriteTags[tag.name] == undefined) {
                            favoriteTags[tag.name] = 0
                        }
                        favoriteTags[tag.name] += Math.round(vn.length_minutes / 6) / 10
                    }
                }
            })
        });

        favoriteTags = Object.keys(favoriteTags).map((key: any) => { return { name: key, value: favoriteTags[key] } })

        favoriteTags.sort((a: any, b: any) => {
            return a.minutesRead - b.minutesRead;
        });

        if (favoriteTags.length > 10) {
            favoriteTags.slice(0, 10)
        }

        // rating disrib
        const ratingDistribution = [10]

        ratedEntries.forEach((entry: any, id: number) => {
            if (entry.rating != null) {
                ratingDistribution[10 - entry.rating] += 1
            }
        })

        // recent activity
        var recentActivityData: IRecentActivityEntry[] = []
        var filteredVnData: any = vnData
            .filter((vn: any) =>
                vaultEntries.slice(0, 5).some((entry: any) => vn.id === parseInt(entry.vid.substring(1))))
            .sort((a: any, b: any) => {
                const indexA = vaultEntries.findIndex((entry: any) => a.id === parseInt(entry.vid.substring(1)));
                const indexB = vaultEntries.findIndex((entry: any) => b.id === parseInt(entry.vid.substring(1)));
                return indexA - indexB;
            });



        filteredVnData.forEach((vn: any, id: number) => {
            const activityEntry: IRecentActivityEntry = {
                vn: vn,
                date: vaultEntries[id].updated_at.split('T')[0],
                status: statusNumberToEnum(vaultEntries[id].status),
                rating: vaultEntries[id].rating != 0 && vaultEntries[id].rating
            };

            recentActivityData.push(activityEntry);
        });

        const stats: IUserStats = {
            totalVnsFinished: finishedVaultEntries.length,
            totalVnsReading: readingVaultEntries.length,
            totalVnsToRead: toReadVaultEntries.length,
            totalVnsDropped: droppedVaultEntries.length,
            totalVnsInList: vaultEntries.length,
            totalMinutesRead: totalMinutesRead,

            ratingDistribution: ratingDistribution,
            averageRating: averageRating,
            ratedVns: ratedEntries.length,
            averageVotecount: averageVotecount,
            averageRatingPlayed: averageRatingPlayed,
            favoriteTags: favoriteTags,
            recentActivity: recentActivityData
        }

        return stats
    }

    // detailed user info
    async getUserProfileByName(name: string): Promise<IUserProfile> {
        const userData = await this.supabase.from('users').select('*').eq('username', name).single()
        const vaultRes = await this.supabase.from('vault_entries').select('*').eq('owner_id', userData.data.id).order('updated_at', { ascending: false })
        const vaultEntries = vaultRes.data
        const vnData: IVN[] = await getVnById(vaultEntries?.map((entry: any) => parseInt(entry.vid.substring(1))) as number[]) as IVN[]

        const avatar = await this.getAvatar(userData.data)

        const stats = await this.getUserStats(userData.data.id, vnData)

        const vault = await this.db.vaults.getVaultByName(name, vnData)

        const favoriteNovelIds: number[] = userData.data.favorite_novels.map((str: string) => parseInt(str.substring(1)));
        const favoriteNovelData: IVNBasic[] = await getVnById(favoriteNovelIds) as IVNBasic[]

        const favoriteCharacterIds: number[] = userData.data.favorite_characters.map((str: string) => parseInt(str.substring(1)));
        const favoriteCharacterData: ICharacterBasic[] = await getCharactersById(favoriteCharacterIds) as ICharacterBasic[]

        const userProfile: IUserProfile = {
            uuid: userData.data.id,
            username: userData.data.username,
            joinedOn: userData.data.created_at.split('T')[0],
            avatarUrl: avatar.data.publicUrl,
            bio: userData.data.bio,
            favoriteVisualNovels: favoriteNovelData,
            favoriteCharacters: favoriteCharacterData,
            stats: stats,
            vault: vault
        }

        return userProfile
    }

    // basic user info
    async getUserInfoById(id: string): Promise<any> {
        console.log(id)
        const userData = await this.supabase.from('users').select('*').eq('id', id).single()
        console.log(userData)

        return userData.data
    }

    async updateUser(uuid: string, userData: any) {
        return await this.supabase.from('users').update(userData).eq('id', uuid)
    }

    async getAvatar(userData: any) {
        if (userData.has_avatar == false) {
            return await this.supabase.storage.from('user_profiles').getPublicUrl('default.jpg?updated')
        }
        else {
            const url = 'avatars/' + userData.id + '.png?t=' + userData.updated_at
            return await this.supabase.storage.from('user_profiles').getPublicUrl(url)
        }
    }

}

function statusNumberToEnum(num: number) {
    switch (num) {
        case 0: return IVaultStatus.Finished
        case 1: return IVaultStatus.Reading
        case 2: return IVaultStatus.ToRead
        case 3: return IVaultStatus.Dropped
    }
    return IVaultStatus.ToRead
}
