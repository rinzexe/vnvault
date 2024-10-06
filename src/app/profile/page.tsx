'use client'

import { useEffect, useState } from 'react'
import { permanentRedirect, redirect, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'


export default function PrivatePage() {

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchProfile() {
            const data = await auth.db.users.getUserInfoById(auth.user?.id!)
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