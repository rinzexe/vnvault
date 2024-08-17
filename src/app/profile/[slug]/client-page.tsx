'use client'

import { useEffect, useState } from "react";
import ProfilePanel from "../_components/profile-panel";
import { useAuth } from "@/app/_components/auth-provider";
import { useRouter } from "next/navigation";

export default function ClientProfile({ params }: { params: { slug: string } }) {
    const [userData, setProfile] = useState<any>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchProfile() {
            const data = await auth.getUserDataWithUsername(params.slug)

            setProfile(data)
            setLoaded(true)
        }

        fetchProfile()
    }, [auth])

    return (
        <div>
            {userData ? <ProfilePanel slug={params.slug} userData={userData} auth={auth} /> :
                (
                    loaded ? (
                        <div className='grid grid-rows-1 grid-cols-1 p-4'>
                            <div className="grid-center w-full h-full flex justify-center items-center z-30">
                                <h1>
                                    User not found
                                </h1>
                            </div>
                            <div className='backdrop-blur-md bg-black/50 grid-center z-20'>

                            </div>
                            <div className='grid-center m-4'>
                                <ProfilePanel slug={params.slug} userData={{ avatar: "https://cbdyelxczooainxtfjgp.supabase.co/storage/v1/object/public/user_profiles/default.jpg", created_at: "26-06-1999T", xp: 2627, total_incorrect: 256, total_correct: 367, longest_streak: 23 }} auth={auth} />
                            </div>
                        </div>
                    ) : (
                        <div className='grid grid-rows-1 grid-cols-1 p-4'>
                            <div className='backdrop-blur-md grid-center z-20'>

                            </div>
                            <div className='grid-center m-4'>
                                <ProfilePanel slug={params.slug} userData={{ avatar: "https://cbdyelxczooainxtfjgp.supabase.co/storage/v1/object/public/user_profiles/default.jpg", created_at: "26-06-1999T", xp: 2627, total_incorrect: 256, total_correct: 367, longest_streak: 23 }} auth={auth} />
                            </div>
                        </div>
                    )
                )}
        </div>
    )
}