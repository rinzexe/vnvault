import AccentButton from "@/app/_components/accent-button"
import AvatarUpload from "@/app/profile/_components/avatar-upload"
import LevelBar from "@/app/_components/level-bar"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import OpenSVG from "@/app/_components/svgs/open"
import { useAuth } from "@/app/_components/auth-provider"
import PieChartComponent from "@/app/_components/charts/pie-chart"
import Info from "./tabs/info"
import VNStats from "./tabs/vnstats"
import GameStats from "./tabs/game-stats"
import Reviews from "./tabs/reviews"
import EditSVG from "@/app/_components/svgs/edit"

export default function ProfilePanel({ userData, slug, stats }: any) {
    const [currentTab, setCurrentTab] = useState<number>(0)
    const [isEditingBio, setIsEditingBio] = useState<boolean>(false)
    const auth = useAuth()

    const bioEditRef = useRef<any>()

    var isMe = false

    if (userData.id == auth.user?.id) {
        isMe = true
    }

    const Tab = useCallback(() => {
        switch (currentTab) {
            case 0: return <Info username={slug} isMe={isMe} stats={stats} />
            case 1: return <VNStats stats={stats} />
            case 2: return <GameStats userData={userData} />
            case 3: return <Reviews />
        }
    }, [currentTab])

    function setBio(e: any) {
        auth.updateUser(auth.user.id, { bio: e.get('bio') })
        setIsEditingBio(false)
        userData.bio = e.get('bio')
    }

    useEffect(() => {
        console.log(bioEditRef)
        bioEditRef.current?.addEventListener('keypress', (e: any) => {
            var numberOfLines = (bioEditRef.current.value.match(/\n/g) || []).length + 1
            var maxRows = 1;

            if (e.which === 13 && numberOfLines === maxRows) {
                e.preventDefault()
                return false;
            }
        })

    }, [bioEditRef, isEditingBio])

    return (
        <div className='flex flex-col items-center gap-12'>
            <div className='flex flex-col items-center gap-6 w-full max-w-page'>
                <div className='flex  w-full lg:flex-row flex-col justify-center lg:items-center gap-8 '>
                    <div className="flex w-full lg:flex-row flex-col items-center lg:h-48 lg:w-fit gap-8">
                        <div className="w-48 h-48">
                            {userData && !isMe && <img src={userData.avatar} alt='avatar' width={300} height={300} className='rounded-full flex-grow w-auto lg:h-full' />}
                            {userData && isMe && (
                                <AvatarUpload>
                                    <img src={userData.avatar} alt='avatar' width={300} height={300} className='rounded-full flex-grow w-full h-auto  ' />
                                </AvatarUpload>
                            )}
                        </div>
                        <div className="flex w-full lg:w-3/6 flex-col gap-4">
                            <div>
                                <h1>{userData?.username}</h1>
                                <p className="text-xs text-neutral-500">
                                    {"Joined on " + userData?.created_at.split('T')[0]}
                                </p>
                            </div>
                            <div className="flex w-full gap-4">
                                {isEditingBio ? (
                                    <form action={setBio}>
                                        <textarea id="bio" name="bio" ref={bioEditRef} wrap="hard" cols={100} className="bg-black break-words resize-none w-full " maxLength={64}>
                                            {userData.bio}
                                        </textarea>
                                        <AccentButton>
                                            <input type="submit" value={"Save"} />
                                        </AccentButton>
                                    </form>
                                ) : (
                                    <>
                                        <p>
                                            {userData.bio != "" ? userData.bio : "No bio."}
                                        </p>
                                        {isMe && (
                                            <button className="lg:block hidden" onClick={() => { setIsEditingBio(true) }}>
                                                <EditSVG className="w-8 hover:stroke-blue-500 duration-300" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                <div className="w-full overflow-x-scroll lg:overflow-x-auto px-8 lg:px-0 flex lg:justify-center items-center gap-12">
                    <MenuButton setCurrentTab={setCurrentTab} id={0} label="Profile" active={currentTab == 0} />
                    <MenuButton setCurrentTab={setCurrentTab} id={1} label="Reading Stats" active={currentTab == 1} />
                    <MenuButton setCurrentTab={setCurrentTab} id={2} label="Challenge stats" active={currentTab == 2} />
                    <MenuButton setCurrentTab={setCurrentTab} id={3} label="Reviews" active={currentTab == 3} />
                    <Link className="flex items-center group" href={"/profile/" + userData.username + "/vault"}>
                        <h3 className="w-max">
                            Vault
                        </h3>
                        <OpenSVG className="fill-white group-hover:fill-blue-500 h-8 storke-white duration-300" />
                    </Link>
                </div>
                <div className="lg:panel w-full">
                    <Tab />
                </div>
                {auth && isMe && <AccentButton onClick={() => { auth.signOut() }}>Sign Out</AccentButton>}
            </div>
        </div >
    )
}

function MenuButton({ label, active, setCurrentTab, id }: any) {
    return (
        <button className="group w-max" onClick={() => { setCurrentTab(id) }}>
            <h3 className="w-max">
                {label}
            </h3>
            {active ?
                <div className="w-full h-[3px] bg-blue-500 shadow-[0px_0px_5px_rgba(59,130,255,1),0px_0px_10px_rgba(59,130,255,1),0px_0px_25px_rgba(59,130,255,1.0),0px_0px_35px_rgba(59,130,255,1.0)]" /> :
                <div className="w-full h-[1px] duration-300 group-hover:bg-blue-500 group-hover:shadow-[0px_0px_5px_rgba(59,130,255,1),0px_0px_10px_rgba(59,130,255,1),0px_0px_25px_rgba(59,130,255,1),0px_0px_35px_rgba(59,130,255,1)]" />}
        </button>
    )
}
