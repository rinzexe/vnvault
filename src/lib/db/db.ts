import { SupabaseClient } from "@supabase/supabase-js"
import { Users } from "./users"
import { Vaults } from "./vaults"

export default class Database {
    supabase: SupabaseClient
    users: Users
    vaults: Vaults

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase
        this.users = new Users(supabase, this)
        this.vaults = new Vaults(supabase, this)
    }

    async checkIfNameExists(username: string) {
        const { data, error } = await this.supabase.from('users').select('*').eq('username', username).single()
        return data
    }
}