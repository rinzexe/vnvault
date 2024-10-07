'use client'

import Database from '@/lib/db/db';
import { createClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect, createContext } from 'react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

interface AuthContextType {
    signUp: (data: any) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    db: Database; 
    supabase: any; 
    user: User | null;
    forceRerender: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [rerenderTrigger, setRerenderTrigger] = useState(0); // New state to force rerender

    const router = useRouter();
    const db = new Database(supabase);

    // Force rerender function
    function forceRerender() {
        setRerenderTrigger(prev => prev + 1); // This will trigger a rerender when called
    }

    // Sign In function
    function signIn(email: string, password: string) {

        supabase.auth.signInWithPassword({ email, password }).then((res: any) => {
            if (res.error) {
                router.push('/error');
            } else {
                router.push('/profile');
            }
        });
    }

    // Sign Up function
    async function signUp(formData: FormData) {
        const username = formData.get('username') as string;
        const userCheck = await new Database(supabase).checkIfNameExists(username);

        if (userCheck) {
            alert("Username taken");
            return;
        }

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        supabase.auth.signUp(data).then((res: any) => {
            if (res.error) {
                router.push('/error');
            }

            // temporary solution to defaulting favorites to an empty array
            supabase.from('users').insert({ id: res.data.user.id, username, favorite_novels: [], favorite_characters: [] }).then(() => {
                router.push('/profile');
            });
        });

        return "success";
    }

    // Sign Out function
    function signOut() {
        supabase.auth.signOut();
        router.push('/');
    }

    useEffect(() => {
        let listener: any;

        async function setupUser() {
            const session = await supabase.auth.getSession();

            setUser(session.data.session?.user ?? null);
            setLoading(false);

            const { data: listener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
                setUser(session?.user ?? null);
                setLoading(false);
            });
        }

        setupUser();

        return () => {
            listener?.unsubscribe();
        };
    }, []);

    const value: any = {
        signUp: async (data: any) => await signUp(data),
        signIn: async (email: string, password: string) => await signIn(email, password),
        signOut: () => signOut(),
        db,
        supabase,
        user,
        forceRerender, // Expose forceRerender function
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && <div className='w-full max-w-screen-xl' key={rerenderTrigger}>{children}</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
};
