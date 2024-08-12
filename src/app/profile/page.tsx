'use client'

import { createClient } from '@/utils/supabase/server'
import FileUpload from '../_components/file-upload'
import AccentButton from '../_components/accent-button'
import { useEffect, useState } from 'react'
import { permanentRedirect, redirect, useRouter } from 'next/navigation'
import { useAuth } from '../_components/auth-provider'
import Image from 'next/image'

export default function PrivatePage() {
    const [userData, setProfile] = useState<any>(null)

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchProfile() {
            const data = await auth.getUserData(auth.user.id)
            setProfile(data)
        }

        const user = auth.user
        if (!user) {
            router.push('/signin')
        }
        else { 
            fetchProfile()
        }
    }, [auth])

    return (
        <div className='flex flex-col items-center gap-12'>
            <div className='flex flex-row items-center gap-8'>
                {userData && <Image src={userData.avatar} alt='avatar' width={300} height={300} className='rounded-full' />}
                <div>
                    <h1>{userData?.username}</h1>
                    <p>
                        {"Joined on " + userData?.created_at.split('T')[0]}
                    </p>
                </div>
            </div>
            <div>
                <h1>Stats</h1>
                <p>
                    {"XP: " + userData?.xp}
                </p>
                <p>
                    {"Longest streak: " + userData?.longest_streak}
                </p>
                <p>
                    {"Total misses: " + userData?.total_incorrect}
                </p>
                <p>
                    {"Total hits: " + userData?.total_correct}
                </p>
            </div>
            <AccentButton onClick={() => { auth.signOut() }}>Sign Out</AccentButton>
        </div>
    )
}