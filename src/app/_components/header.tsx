'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import AccentButton from "./accent-button";
import Image from "next/image";
import { useAuth } from "./auth-provider";
import SearchSVG from "./svgs/search";

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
        <div>
            {mobileMenuOpen && <MobileMenu userProfile={userProfile} setMobileMenuOpen={setMobileMenuOpen} />}
            <div className="flex flex-row justify-between z-30 w-full  lg:p-0 lg:px-4 items-center  h-20 top-0 fixed panel rounded-none border-t-0 border-r-0 border-l-0">
                <div className="flex flex-row items-center gap-16">
                    <Link className="select-none ml-4" href="/">
                        <h1>
                            VNVault
                        </h1>
                    </Link>
                    <div className="hidden lg:flex flex-row items-center gap-4">
                        <Link className="lg:hover:bg-white/10 rounded-xl flex items-center px-3 gap-2 py-1 duration-300" href="/search">
                            <h4>
                                Search
                            </h4>
                            <SearchSVG className="fill-white w-5 h-5" />
                        </Link>
                        <Link className="lg:hover:bg-white/10 rounded-xl px-3 py-1 duration-300" href="/play">
                            <h4>
                                Play
                            </h4>
                        </Link>
                    </div>
                </div>
                <div className="hidden lg:block lg:hover:bg-white/10 rounded-xl px-3 py-1">
                    <ProfileButton />
                </div>
                <div className="lg:hidden h-full">
                    <svg onClick={() => setMobileMenuOpen(true)} className="h-full w-auto" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="rgb(255,255,255)">
                        <path d="M4 18L20 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 12L20 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 6L20 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

function MobileMenu({ setMobileMenuOpen, userProfile }: any) {
    function ProfileButton() {
        if (userProfile) {
            return (
                <div className="panel flex flex-col gap-2 w-full">
                    <Link href="/profile">
                        <div className="flex-row flex items-center gap-6">
                            <Image className="rounded-full" src={userProfile.avatar} alt="" width={80} height={80} />
                            <h2>
                                {userProfile.username}
                            </h2>
                        </div>
                    </Link>
                    <Link className="pointer-events-auto w-full mt-4 " onClick={() => { setMobileMenuOpen(false) }} href="/profile">
                        <h3 className=" w-full">
                            Profile
                        </h3>
                    </Link>
                    <Link className="pointer-events-auto w-full" onClick={() => { setMobileMenuOpen(false) }} href={"/profile/" + userProfile.username + "/vault"}>
                        <h3 className=" w-full">
                            Vault
                        </h3>
                    </Link>
                </div>
            )
        } else {
            return (
                <div className="flex flex-col panel w-full gap-2 items-center ">
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
        <div className="fixed pointer-events-auto w-screen h-screen p-4 z-50 bg-black/50">
            <div className="flex flex-col w-full h-full gap-4 relative panel">
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
                <div className="h-full flex w-full flex-col gap-4 items-center  pointer-events-none">
                    <ProfileButton />
                    <Link href="/search" className="pointer-events-auto w-full ">
                        <AccentButton className="w-full">
                            <h3 className="p-3 text-left w-full">
                                VN Search
                            </h3>
                        </AccentButton>
                    </Link>
                    <Link className="pointer-events-auto w-full " onClick={() => { setMobileMenuOpen(false) }} href="/play">
                        <AccentButton className="w-full">
                            <h3 className="p-3 text-left w-full">
                                Play
                            </h3>
                        </AccentButton>
                    </Link>
                </div>
            </div>
        </div>
    )
}