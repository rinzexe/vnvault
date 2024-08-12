'use client'

import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect, createContext } from 'react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

const defaultValues: any = {
    signUp: null,
    signIn: null,
    signOut: null,
    user: null
}

const AuthContext = createContext(defaultValues);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState(true);

    const router = useRouter()

    function signIn(formData: FormData) {

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }
    
        supabase.auth.signInWithPassword(data).then((res: any) => {
            if (res.error) {
                router.push('/error')
            }
        
            router.push('/')
        })
    }
    
    function signUp(formData: FormData) {
    
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }
    
        supabase.auth.signUp(data).then((res: any) => {
            if (res.error) {
                router.push('/error')
            }

            supabase.from('users').insert({ id: res.user.id, username: formData.get('username') as string })
        
            router.push('/profile')
        })
    }
    
    function signOut() {
        supabase.auth.signOut().then((res: any) => {
            router.push('/')
        })
    }
    

    useEffect(() => {
        var listener: any;
        async function setupUser() {
            const session = await supabase.auth.getSession();

            setUser(session.data.session?.user ?? null);
            setLoading(false);

            const { data: listener } = supabase.auth.onAuthStateChange(
                (event: any, session: any) => {
                    console.log("statechange")
                    setUser(session?.user ?? null);
                    setLoading(false);
                }
            );
        }

        setupUser();

        return () => {
            listener?.unsubscribe();
        };

    }, []);

    const value: any = {
        signUp: async (data: any) => { signUp(data) },
        signIn: async (data: any) => { signIn(data) },
        signOut: async () => { signOut() },
        getUserData,
        getAvatar,
        updateStats,
        supabase,
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export async function getUserData(uuid: string) {
    const avatar = await getAvatar(uuid)
    const userdata = await supabase.from('users').select('*').eq('id', uuid).single()
    console.log(userdata)
    return { avatar: avatar?.data.publicUrl, username: userdata?.data?.username, ...userdata?.data } 
}

export async function getAvatar(uuid: string) {
    const { data, error } = await supabase.rpc('storage_avatar_exists', {
        uid: uuid,
        path: uuid + '/avatar.png'
    });

    if (!data) {
        return await supabase.storage.from('user_profiles').getPublicUrl('default.jpg')
    }
    else {
        return await supabase.storage.from('user_profiles').getPublicUrl(uuid + '/avatar.png')
    }
}


export async function updateStats(uuid: string, streak: number, correct: boolean, vnData: any) {
    const currentData: any = await supabase.from('users').select('*').eq('id', uuid).single()

    if (currentData.data.longest_streak < streak) {
        const res = await supabase.from('users').update({ longest_streak: streak }).eq('id', uuid)
    }

    if (correct) {
        const res = await supabase.from('users').update({ total_correct: currentData.data.total_correct + 1 }).eq('id', uuid)
    }
    else {
        const res = await supabase.from('users').update({ total_incorrect: currentData.data.total_incorrect + 1 }).eq('id', uuid)
    }

    const xpValue = Math.ceil((50000 - vnData.votecount) / 3000 * streak)

    console.log(xpValue)

    const res = await supabase.from('users').update({ xp: currentData.data.xp + xpValue }).eq('id', uuid)

    return xpValue
}