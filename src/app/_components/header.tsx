'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import AccentButton from "./accent-button";
import Image from "next/image";
import { useAuth } from "./auth-provider";

export default function Header() {
    const [userProfile, setUserProfile] = useState<any>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

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
                <div className="flex-row items-center gap-8">
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
        <div>
            {mobileMenuOpen && <MobileMenu setMobileMenuOpen={setMobileMenuOpen} />}
            <div className="flex flex-row justify-between z-30 w-full  lg:p-0 lg:px-8 items-center  h-20 top-0 fixed panel rounded-none border-t-0 border-r-0 border-l-0">
                <div className="flex flex-row items-center gap-16">
                    <Link className="select-none" href="/">
                        <h1>
                            VNVault
                        </h1>
                    </Link>
                    <div className="hidden lg:flex flex-row items-center gap-8">
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
                <div className="hidden lg:block">
                    <ProfileButton />
                </div>
                <div className="lg:hidden h-full">
                    <svg onClick={() => setMobileMenuOpen(true)} className="h-full w-auto" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="rgb(255,255,255)">
                        <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                        <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                        <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

function MobileMenu({ setMobileMenuOpen }: any) {
    return (
        <div className="fixed w-screen h-screen p-4 z-50 bg-black/50">
            <div className="flex flex-col w-full h-full gap-4 relative panel">
                <div className="w-full h-full flex right-0 top-0 bottom-0 left-0 flex-col gap-4 items-center absolute justify-center pointer-events-none">
                    <Link className="pointer-events-auto" onClick={() => { setMobileMenuOpen(false) }} href="/challenge">
                        <h3>
                            Play
                        </h3>
                    </Link>
                    <Link className="pointer-events-auto" onClick={() => { setMobileMenuOpen(false) }} href="/leaderboard">
                        <h3>
                            Leaderboard
                        </h3>
                    </Link>
                    <Link className="pointer-events-auto" onClick={() => { setMobileMenuOpen(false) }} href="/profile">
                        <h3>
                            Profile
                        </h3>
                    </Link>
                </div>
                <div className="grid grid-cols-3 items-center content-center">
                    <div></div>
                    <Link className="select-none text-center" href="/">
                        <h1>
                            VNVault
                        </h1>
                    </Link>
                    <button className="justify-self-end" onClick={() => { setMobileMenuOpen(false) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="0 0 24 24" fill="none">
                            <path d="M16 8L8 16M8 8L16 16" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}