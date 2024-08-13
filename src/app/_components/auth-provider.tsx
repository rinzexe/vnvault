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

            router.push('/profile')
        })
    }

    async function signUp(formData: FormData) {

        const username = formData.get('username') as string

        const userCheck = await checkIfNameExists(username)

        if (userCheck.username) {
            alert("Username taken")
            return
        }

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }

        supabase.auth.signUp(data).then((res: any) => {
            if (res.error) {
                router.push('/error')
            }

            supabase.from('users').insert({ id: res.data.user.id, username: username }).then((res: any) => {
                router.push('/profile')
            })
        })

        return "success"
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
        signUp: async (data: any) => { return await signUp(data) },
        signIn: async (data: any) => { return await signIn(data) },
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

async function checkIfNameExists(username: string) {
    const { data, error } = await supabase.from('users').select('*').eq('username', username).single()
    return data
}

async function getUserData(uuid: string) {
    const avatar = await getAvatar(uuid)
    const userdata = await supabase.from('users').select('*').eq('id', uuid).single()
    return { avatar: avatar?.data.publicUrl, username: userdata?.data?.username, ...userdata?.data }
}

async function getAvatar(uuid: string) {
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

    var payload: any = {}

    if (currentData.data.longest_streak < streak) {
        payload['longest_streak'] = streak
    }

    if (correct) {
        payload['total_correct'] = currentData.data.total_correct + 1
    }
    else
    {
        payload['total_incorrect'] = currentData.data.total_incorrect + 1
    }

    const xpValue = Math.ceil((50000 - vnData.votecount) / 3000 * streak)
    payload['xp'] = currentData.data.xp + xpValue

    const res = await supabase.from('users').update(payload).eq('id', uuid)

    return xpValue
}