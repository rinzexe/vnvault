import { IVaultStatus, IVNVault, IVNVaultEntry } from "@/types/vault";
import { IVN } from "@/types/vn";
import { SupabaseClient } from "@supabase/supabase-js"
import Database from "./db";

export class Vaults {
    supabase: SupabaseClient
    db: Database

    constructor(supabase: SupabaseClient, db: Database) {
        this.supabase = supabase
        this.db = db
    }

    async getVaultByName(name: string, vnData: IVN[]): Promise<IVNVault> {
        const { data: userdata, error: userError } = await this.supabase
            .from('users')
            .select('*')
            .eq('username', name)
            .single();

        if (userError || !userdata) {
            throw new Error('User not found');
        }

        const { data: vaultEntries, error: vaultError } = await this.supabase
            .from('vault_entries')
            .select('*')
            .eq('owner_id', userdata.id);

        if (vaultError || !vaultEntries) {
            throw new Error('Vault entries not found');
        }

        const vault: IVNVault = {
            entries: vaultEntries.map((entry: any) => {
                const vn = vnData.find(vn => vn.id === parseInt(entry.vid.substring(1)));

                return {
                    vn: vn,
                    rating: entry.rating,
                    status: statusNumberToEnum(entry.status),
                    createdAt: entry.created_at,
                    updatedAt: entry.updated_at
                };
            }) as IVNVaultEntry[]
        }

        return vault;
    }

    async updateVault(uuid: string, rating: number, status: number, vid: number, remove?: boolean) {
        if (remove) {
            const res = await this.supabase.from('vault_entries').delete().eq('owner_id', uuid).eq('vid', "v" + vid)
        }
        else {
            const res = await this.supabase.from('vault_entries').upsert({
                owner_id: uuid,
                vid: "v" + vid,
                rating: parseFloat(rating.toFixed(1)), 
                status: status
            })

            return res.data
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
