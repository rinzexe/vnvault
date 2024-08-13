'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import AccentButton from "./accent-button";
import Image from "next/image";
import { useAuth } from "./auth-provider";

export default function Header() {
    const [userProfile, setUserProfile] = useState<any>(null)

    const auth: any = useAuth()

    useEffect(() => {

        async function checkUser() {
            if (auth.user != null) {

                const profile = await auth.getUserData(auth.user.id)
                setUserProfile(profile)
            }
            else {
                setUserProfile(null)
            }
        }

        checkUser()
    }, [setUserProfile, auth])


    function ProfileButton() {
        if (userProfile) {
            return (
                <Link href="/profile">
                    <div className="flex-row flex items-center gap-4">
                        <h1>
                            {userProfile.username}
                        </h1>
                        <Image className="rounded-full" src={userProfile.avatar} alt="" width={80} height={80} />
                    </div>
                </Link>
            )
        } else {
            return (
                <div className="flex flex-row items-center gap-8">
                    <Link href="/signin">
                        Login
                    </Link>
                    <Link href="/signup">
                        <AccentButton>
                            Sign up
                        </AccentButton>
                    </Link>
                </div>
            )
        }
    }

    return (
        <div className="flex flex-row justify-between w-full p-8">
            <div className="flex flex-row items-center gap-16">
                <Link className="select-none" href="/">
                    <h1>
                        VNVault
                    </h1>
                </Link>
                <div className="flex flex-row items-center gap-8">
                    <Link href="/leaderboard">
                        <h3>
                            Leaderboard
                        </h3>
                    </Link>
                    <Link href="/challenge">
                        <h3>
                            Challenge
                        </h3>
                    </Link>
                </div>
            </div>
            <ProfileButton />
        </div>
    )
}