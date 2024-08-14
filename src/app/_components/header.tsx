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
                    <div className="flex-row flex items-center gap-6">
                        <h2>
                            {userProfile.username}
                        </h2>
                        <Image className="rounded-full" src={userProfile.avatar} alt="" width={50} height={50} />
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
        <div className="flex flex-row justify-between w-full px-8 items-center h-20 top-0 fixed panel rounded-none border-t-0 border-r-0 border-l-0">
            <div className="flex flex-row items-center gap-16">
                <Link className="select-none" href="/">
                    <h1>
                        VNVault
                    </h1>
                </Link>
                <div className="flex flex-row items-center gap-8">
                    <Link href="/leaderboard">
                        <h4>
                            Leaderboard
                        </h4>
                    </Link>
                    <Link href="/challenge">
                        <h4>
                            Play
                        </h4>
                    </Link>
                </div>
            </div>
            <ProfileButton />
        </div>
    )
}