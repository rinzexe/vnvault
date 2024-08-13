'use client'

import { createClient } from '@/utils/supabase/server'
import FileUpload from '../_components/file-upload'
import AccentButton from '../_components/accent-button'
import { useEffect, useState } from 'react'
import { permanentRedirect, redirect, useRouter } from 'next/navigation'
import { useAuth } from '../_components/auth-provider'
import Image from 'next/image'
import { calculateLevel } from '@/utils/levels'
import LevelBar from '../_components/level-bar'
import Profile from '../_components/file-upload'

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
        <div>
            {userData ? <ProfilePanel userData={userData} auth={auth} /> :
                (
                    <div className='grid grid-rows-1 grid-cols-1 p-4'>
                        <div className='backdrop-blur-md grid-center z-20'>

                        </div>
                        <div className='grid-center m-4'>
                            <ProfilePanel userData={{ avatar: "https://cbdyelxczooainxtfjgp.supabase.co/storage/v1/object/public/user_profiles/default.jpg", created_at: "26-06-1999T", xp: 2627, total_incorrect: 256, total_correct: 367, longest_streak: 23 }} auth={auth} />
                        </div>
                    </div>
                )}
        </div>
    )
}

function ProfilePanel({ userData, auth }: any) {
    return (
        <div className='flex flex-col items-center gap-12'>
            <div className='flex flex-row items-center gap-8 h-[300px]'>
                {userData && <Image src={userData.avatar} alt='avatar' width={300} height={300} className='rounded-full' />}
                <div>
                    <h1>{userData?.username}</h1>
                    <p>
                        {"Joined on " + userData?.created_at.split('T')[0]}
                    </p>
                </div>
            </div>
            <LevelBar xp={userData?.xp} />
            <Stats userData={userData} />
            {auth && <AccentButton onClick={() => { auth.signOut() }}>Sign Out</AccentButton>}
        </div>
    )
}

function Stats({ userData }: any) {
    return (
        <div className='max-w-[50rem]'>
            <h1 className='mb-4 text-center'>Stats</h1>
            <div className='grid grid-rows-2 grid-cols-4 gap-3 panel'>
                <Stat title='Total XP' value={userData?.xp} symbol='' />
                <Stat title='Total guesses' value={userData?.total_incorrect + userData?.total_correct} symbol='' />
                <Stat title='Longest streak' value={userData?.longest_streak} symbol='' />
                <Stat title='Global rank' value={0} symbol='' />
                <Stat title='Total hits' value={userData?.total_correct} symbol='' />
                <Stat title='Total misses' value={userData?.total_incorrect} symbol='' />
                <Stat title='Hit %' value={Math.round(userData?.total_correct / (userData?.total_incorrect + userData?.total_correct) * 1000) / 10} symbol='%' />
                <Stat title='Time played' value={0} symbol='' />
            </div>
        </div>
    )
}

function Stat({ title, value, symbol }: any) {
    return (
        <div>
            <p className='text-sm'>{title}</p>
            <h2 className=''>
                {value + symbol}
            </h2>
        </div>
    )
}