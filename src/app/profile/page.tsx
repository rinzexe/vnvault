'use client'

import { createClient } from '@/utils/supabase/server'
import FileUpload from './_components/avatar-upload'
import AccentButton from '../_components/accent-button'
import { useEffect, useState } from 'react'
import { permanentRedirect, redirect, useRouter } from 'next/navigation'
import { useAuth } from '../_components/auth-provider'
import Image from 'next/image'
import { calculateLevel } from '@/utils/levels'
import LevelBar from '../_components/level-bar'
import Profile from './_components/avatar-upload'
import ProfilePanel from './_components/profile-panel'

export default function PrivatePage() {

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchProfile() {
            const data = await auth.getUserData(auth.user.id)
            router.push(`/profile/${data.username}`)
        }

        const user = auth.user
        if (!user) {
            router.push('/signin')
        }
        else {
            fetchProfile()
        }
    }, [auth])

    return(
        <div>

        </div>
    )
}