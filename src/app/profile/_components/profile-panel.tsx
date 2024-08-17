import AccentButton from "@/app/_components/accent-button"
import AvatarUpload from "@/app/profile/_components/avatar-upload"
import LevelBar from "@/app/_components/level-bar"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import OpenSVG from "@/app/_components/svgs/open"
import { useAuth } from "@/app/_components/auth-provider"
import { vnListSearchById } from "@/utils/vndb"

export default function ProfilePanel({ userData, auth, slug }: any) {
    var isMe = false

    if (userData.id == auth.user?.id) {
        isMe = true
    }
    return (
        <div className='flex flex-col items-center gap-12'>
            <div className='flex flex-col w-full lg:w-auto lg:flex-row lg:items-center gap-8 lg:h-[300px]'>
                {userData && !isMe && <Image src={userData.avatar} alt='avatar' width={300} height={300} className='rounded-full w-full lg:h-full lg:w-auto' />}
                {userData && isMe && (
                    <AvatarUpload>
                        <Image src={userData.avatar} alt='avatar' width={300} height={300} className='rounded-full w-full lg:h-full lg:w-auto' />
                    </AvatarUpload>
                )}
                <div>
                    <h1>{userData?.username}</h1>
                    <p className="lg:text-base text-sm">
                        {"Joined on " + userData?.created_at.split('T')[0]}
                    </p>
                </div>
            </div>
            <Link href={"/profile/" + slug + "/vault"} >
                <AccentButton>
                    <div className="group flex items-center gap-2">
                        <h3 className="group-hover:text-blue-500 group-hover:font-bold duration-300">
                            Open vault
                        </h3>
                        <OpenSVG className="fill-white group-hover:fill-blue-500  storke-white duration-300" />
                    </div>
                </AccentButton>
            </Link>
            <LevelBar xp={userData?.xp} />
            <Stats userData={userData} />
            {auth && isMe && <AccentButton onClick={() => { auth.signOut() }}>Sign Out</AccentButton>}
        </div>
    )
}

function Stats({ userData }: any) {
    const [vnStats, setVnStats] = useState<any>()

    const auth = useAuth()

    console.log(userData)

    useEffect(() => {
        async function fetchVnStats() {
            const res = await auth.supabase.from('vault_entries').select('*').eq('owner_id', userData.id).eq('status', 0)
            console.log(res)

            var queries: any = []

            res.data && res.data.forEach((e: any) => {
                queries.push(e.vid)
            });

            const vnData = await vnListSearchById(queries, { type: "title", asc: false })
       
            var totalMinutes = 0
            
            vnData.forEach((vn: any) => {
                totalMinutes += vn.length_minutes
            });

            console.log(totalMinutes)

            setVnStats({totalMinutes, novelsRead: res.data.length})
        }

        fetchVnStats()
    }, [])

    if (vnStats) {
        return (
            <div className='max-w-[50rem]'>
                <h1 className='mb-4 text-center'>Stats</h1>
                <div className=" flex flex-col lg:flex-row items-center gap-4">
                    <div className='grid grid-rows-3 grid-cols-2 lg:grid-rows-2 lg:grid-cols-3 gap-3 panel'>
                        <Stat title='Total XP' value={userData?.xp} symbol='' />
                        <Stat title='Total guesses' value={userData?.total_incorrect + userData?.total_correct} symbol='' />
                        <Stat title='Longest streak' value={userData?.longest_streak} symbol='' />
                        <Stat title='Total hits' value={userData?.total_correct} symbol='' />
                        <Stat title='Total misses' value={userData?.total_incorrect} symbol='' />
                        <Stat title='Hit %' value={Math.round(userData?.total_correct / (userData?.total_incorrect + userData?.total_correct) * 1000) / 10} symbol='%' />
                    </div>
                    <div className='grid grid-rows-1 grid-cols-2 lg:grid-rows-2 lg:grid-cols-1 gap-3 panel'>
                        <Stat title='Time spent reading' value={Math.round(vnStats.totalMinutes / 60 * 10) / 10} symbol='h' />
                        <Stat title='Novels read' value={vnStats.novelsRead} symbol='' />
                    </div>
                </div>
            </div>
        )
    }
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