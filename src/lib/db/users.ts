import { IUser, IUserStats } from "@/types/user"
import { IVN, IVNBasic } from "@/types/vn"
import { getCharacterById, getVnById } from "../vndb/search"
import { ICharacterBasic } from "@/types/character"
import { genreTags } from "@/consts/genre-tags"
import { IVaultStatus, IVNVault, IVNVaultEntry } from "@/types/vault"
import { SupabaseClient } from "@supabase/supabase-js"
import Database from "./db"
import { toast } from "@/hooks/use-toast"

export class Users {
    supabase: SupabaseClient
    db: Database

    constructor(supabase: SupabaseClient, db: Database, userId?: string) {
        this.supabase = supabase
        this.db = db
    }

    async calculateStats(vault: IVNVault): Promise<IUserStats> {
        const vaultEntries = vault.entries


        // setting up relevant data
        const finishedVaultEntries = vaultEntries.filter((entry: any) => entry.status == IVaultStatus.Finished)
        const readingVaultEntries = vaultEntries.filter((entry: any) => entry.status == IVaultStatus.Reading)
        const toReadVaultEntries = vaultEntries.filter((entry: any) => entry.status == IVaultStatus.ToRead)
        const droppedVaultEntries = vaultEntries.filter((entry: any) => entry.status == IVaultStatus.Dropped)
        const ratedVaultEntries = vaultEntries.filter((entry: any) => entry.rating != 0)

        const finishedAndDroppedEntries = [...finishedVaultEntries, ...droppedVaultEntries]

        let finishedVnData: any = []

        // minutes to read
        let totalMinutesRead = 0

        finishedVaultEntries.forEach((entry: IVNVaultEntry) => {
            totalMinutesRead += entry.vn.length
        });

        // average popularity & rating
        let total = 0;
        for (let i = 0; i < ratedVaultEntries.length; i++) {
            total += ratedVaultEntries[i].rating;
        }
        let averageRating = total / ratedVaultEntries.length;

        let averageVotecount: number = 0

        finishedAndDroppedEntries.forEach((entry) => {
            averageVotecount += entry.vn.rateCount || 0
        })

        averageVotecount /= finishedAndDroppedEntries.length
        averageVotecount = Math.round(averageVotecount)


        let averageRatingPlayed: number = 0

        finishedAndDroppedEntries.forEach((entry) => {
            averageRatingPlayed += entry.vn.rating || 0
        })

        averageRatingPlayed /= finishedAndDroppedEntries.length
        averageRatingPlayed = Math.round(averageRatingPlayed)

        // genre stats
        let favoriteTags: any = {}

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
        const ratingDistribution: number[] = new Array(10).fill(0);

        ratedVaultEntries.forEach((entry: IVNVaultEntry, id: number) => {
            console.log(ratingDistribution)
            if (entry.rating != 0) {
                ratingDistribution[10 - entry.rating] += 1
            }
        })

        const stats: IUserStats = {
            totalVnsFinished: finishedVaultEntries.length,
            totalVnsReading: readingVaultEntries.length,
            totalVnsToRead: toReadVaultEntries.length,
            totalVnsDropped: droppedVaultEntries.length,
            totalVnsInList: vaultEntries.length,
            totalMinutesRead: totalMinutesRead,

            ratingDistribution: ratingDistribution,
            averageRating: averageRating,
            ratedVns: ratedVaultEntries.length,
            averageVotecount: averageVotecount,
            averageRatingPlayed: averageRatingPlayed,
            favoriteTags: favoriteTags,
        }

        return stats
    }

    async getUserById(id: string): Promise<IUser> {
        const userData = await this.supabase.from('users').select('*').eq('id', id).single()

        return await this.getUserByName(userData.data.username)
    }

    // detailed user info
    async getUserByName(name: string): Promise<IUser> {
        const userData = await this.supabase.from('users').select('*').eq('username', name).single()

        const avatar = await this.getAvatar(userData.data)
        const banner = await this.getBanner(userData.data)

        const favoriteNovelIds: number[] = userData.data.favorite_novels.map((str: string) => parseInt(str.substring(1)));

        let favoriteNovelData: IVNBasic[] = []
        if (favoriteNovelIds.length > 0) {
            favoriteNovelData = await getVnById(favoriteNovelIds) as IVNBasic[]
        }

        const favoriteCharacterIds: number[] = userData.data.favorite_characters.map((str: string) => parseInt(str.substring(1)));

        let favoriteCharacterData: ICharacterBasic[] = []
        if (favoriteCharacterIds.length > 0) {
            favoriteCharacterData = await getCharacterById(favoriteCharacterIds) as ICharacterBasic[]
        }

        const userProfile: IUser = {
            uuid: userData.data.id,
            username: userData.data.username,
            joinedOn: userData.data.created_at.split('T')[0],
            avatarUrl: avatar.data.publicUrl,
            bannerUrl: banner.data.publicUrl,
            bio: userData.data.bio,
            favoriteVisualNovels: favoriteNovelData || [],
            favoriteCharacters: favoriteCharacterData || [],
            nsfwEnabled: userData.data.nsfw_enabled
        }

        return userProfile
    }


    async updateUsername(id: string, newName: string) {
        const userCheck = await this.db.checkIfNameExists(newName);

        if (userCheck) {
            toast({ title: "Error", description: "Username exists. Try another name.", variant: "destructive" })
            return;
        }

        const res = await this.supabase.from('users').update({ username: newName }).eq('id', id)

        toast({ title: "Success", description: "Username updated to " + newName })
    }

    async deleteUser(id: string) {
        await this.supabase.auth.admin.deleteUser(id)
        await this.supabase.from('users').delete().eq('id', id)
    }

    // basic user info
    async getUserInfoByName(name: string): Promise<any> {
        const userData = await this.supabase.from('users').select('*').eq('username', name).single()

        return userData.data
    }

    // basic user info
    async getUserInfoById(id: string): Promise<any> {
        const userData = await this.supabase.from('users').select('*').eq('id', id).single()

        return userData.data
    }

    async updateUser(uuid: string, userData: any) {
        return await this.supabase.from('users').update(userData).eq('id', uuid)
    }

    async getAvatar(userData: any) {
        if (userData.has_avatar == false) {
            return await this.supabase.storage.from('user_profiles').getPublicUrl('avatars/default.jpg?updated')
        }
        else {
            const url = 'avatars/' + userData.id + '.jpg?t=' + userData.updated_at
            return await this.supabase.storage.from('user_profiles').getPublicUrl(url)
        }
    }

    async updateAvatar(file: File, userId: string): Promise<string> {
        try {
            const filePath = `avatars/${userId}.jpg`

            const { error: uploadError } = await this.supabase.storage
                .from('user_profiles')
                .update(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            const { data: urlData } = await this.supabase.storage
                .from('user_profiles')
                .getPublicUrl(filePath)

            const res = await this.supabase.from('users').update({ has_avatar: true }).eq('id', userId)

            return urlData.publicUrl
        } catch (error) {
            console.error('Error uploading file:', error)
            throw error
        }
    }

    async getBanner(userData: any) {
        if (userData.has_banner == false) {
            return await this.supabase.storage.from('user_profiles').getPublicUrl('banners/default.jpg?updated')
        }
        else {
            const url = 'banners/' + userData.id + '.jpg?t=' + userData.updated_at
            return await this.supabase.storage.from('user_profiles').getPublicUrl(url)
        }
    }

    async updateBanner(file: File, userId: string): Promise<string> {
        try {
            const filePath = `banners/${userId}.jpg`

            const { error: uploadError } = await this.supabase.storage
                .from('user_profiles')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            const { data: urlData } = await this.supabase.storage
                .from('user_profiles')
                .getPublicUrl(filePath)

            const res = await this.supabase.from('users').update({ has_banner: true }).eq('id', userId)

            return urlData.publicUrl
        } catch (error) {
            console.error('Error uploading file:', error)
            throw error
        }
    }

    async getUsersBySearch(query: string): Promise<IUser[]> {
        const userData = await this.supabase.from('users').select('*').textSearch('username', query)

        let results: IUser[] = []

        userData.data?.forEach(async (data) => {
            const avatar = await this.getAvatar(data)
            const banner = await this.getBanner(data)

            const userProfile: IUser = {
                uuid: data.id,
                username: data.username,
                joinedOn: data.created_at.split('T')[0],
                avatarUrl: avatar.data.publicUrl,
                bannerUrl: banner.data.publicUrl,
                bio: data.bio,
                nsfwEnabled: data.nsfw_enabled
            }

            results.push(userProfile)
        })

        return results
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

