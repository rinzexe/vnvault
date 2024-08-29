'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import AccentButton from "./accent-button";
import Image from "next/image";
import { useAuth } from "./auth-provider";
import SearchSVG from "./svgs/search";
import BurgerMenuSVG from "./svgs/burdermenu";
import ProfileSVG from "./svgs/profile";
import PlusSVG from "./svgs/plus";
import HomeSVG from "./svgs/home";

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
                        <img className="rounded-full" src={userProfile.avatar} alt="" width={50} height={50} />
                    </div>
                </Link>
            )
        } else {
            return (
                <div className="flex flex-row pointer-events-auto items-center gap-8">
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
            <div className="lg:hidden fixed pointer-events-none flex justify-end p-12 items-end h-full w-full z-40">
                <MobileMenu />
            </div>
            <div className="flex-row hidden lg:flex justify-center z-30 w-full lg:p-0 lg:px-4 items-center !bg-black/75 h-20 top-0 fixed panel !rounded-none border-t-0 border-r-0 border-l-0">
                <div className="max-w-page grid grid-cols-3 items-center w-full">
                    <Link className="select-none ml-4" href="/">
                        <h1>
                            VNVault
                        </h1>
                    </Link>
                    <div className="hidden lg:flex justify-self-center flex-row items-center gap-1">
                        <Link className="lg:hover:*:text-white *:duration-300 rounded-xl flex items-center px-3 gap-2 py-1 duration-300" href="/">
                            <p>
                                Home
                            </p>
                        </Link>
                        <Link className="lg:hover:*:text-white *:duration-300 rounded-xl px-3 py-1 duration-300" href="/play">
                            <p>
                                Play
                            </p>
                        </Link>
                        <Link className="lg:hover:*:text-white *:duration-300 rounded-xl flex items-center px-3 gap-2 py-1 duration-300" href="/search">
                            <p>
                                Search
                            </p>
                        </Link>
                        <Link className="lg:hover:*:text-white *:duration-300 rounded-xl px-3 py-1 duration-300" href="/news">
                            <p>
                                News
                            </p>
                        </Link>
                        <Link className="lg:hover:*:text-white *:duration-300 rounded-xl px-3 py-1 duration-300" href="/feedback">
                            <p>
                                Feedback
                            </p>
                        </Link>
                    </div>
                    <div className="hidden justify-self-end lg:block hover:bg-white/10 duration-300 rounded-xl px-3 py-1">
                        <ProfileButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

function MobileMenu({ }: any) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
        <div className="z-40">
            {isOpen ? (
                <div onClick={() => setIsOpen(false)}  className="panel p-4 gap-4 grid grid-cols-2 grid-rows-2 pointer-events-auto">
                    <Link  href="/" className="flex flex-col items-center">
                        <HomeSVG className="fill-white" />
                        <p className="text-xs text-center text-white">
                            Home
                        </p>
                    </Link>
                    <Link  href="/profile" className="flex flex-col items-center">
                        <ProfileSVG className="fill-white" />
                        <p className="text-xs text-center text-white">
                            Profile
                        </p>
                    </Link>
                    <Link  href="/search" className="flex flex-col items-center">
                        <SearchSVG className="fill-white w-10" />
                        <p className="text-xs text-center text-white">
                            Search
                        </p>
                    </Link>
                    <div className="flex flex-col items-center">
                        <PlusSVG className="rotate-45 fill-white" />
                        <p className="text-xs text-center text-white">
                            Close
                        </p>
                    </div>
                </div>
            ) : (
                <div className="panel flex items-center justify-center p-0 h-16 w-16 pointer-events-auto">
                    <BurgerMenuSVG onClick={() => setIsOpen(true)} className="w-12 h-12 stroke-white" />
                </div>
            )}
        </div>
    )
}