'use client'

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getAutofillSuggestions, getRandomPanel } from "./actions";
import { useAuth } from "../_components/auth-provider";
import XpPopup from "./xp-popup";
import LevelBar from "../_components/level-bar";
import StreakBadge from "../_components/streak-badge";
import GamePanel from "./game-panel";
import { calculateXpReward } from "@/utils/levels";

export interface VnData {
    screenshot: string
    title: string
    alttitle: string
    votecount: number
}

export default function Challenge() {
    const [vnData, setVnData] = useState<VnData | undefined>()
    const [lastRounds, setLastRounds] = useState<any>([])
    const [xpPopupValue, setXpPopupValue] = useState<number>(0)
    const [userData, setUserData] = useState<any>(0)
    const [streak, setStreak] = useState<number>(0)

    const auth = useAuth()

    useEffect(() => {
        setVnData(undefined)
        async function getVnData() {
            const gotVnData: VnData = await getRandomPanel(streak)

            const userData = await auth.getUserData(auth.user?.id)

            setUserData(userData)
            setVnData(gotVnData)
        }

        getVnData()
    }, [lastRounds])

    function checkAnswer(answerTitle: string) {
        if (answerTitle === vnData?.title) {
            setStreak(streak + 1)

            if (lastRounds.length > 10) {
                setLastRounds([...lastRounds, { pass: true, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }].slice(1))
            }
            else {
                setLastRounds([...lastRounds, { pass: true, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }])
            }

            if (auth.user != null) {
                auth.updateStats(auth.user.id, streak + 1, true, Math.ceil(calculateXpReward(vnData.votecount, streak)))
                setXpPopupValue(Math.ceil(calculateXpReward(vnData.votecount, streak)))
            }
        }
        else {
            setStreak(0)

            if (lastRounds.length > 10) {
                setLastRounds([...lastRounds, { pass: false, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }].slice(1))
            }
            else {
                setLastRounds([...lastRounds, { pass: false, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }])
            }

            if (auth.user != null) {
                auth.updateStats(auth.user.id, 0, false, 0)
            }
        }
    }

    return (
        <main className="flex flex-col items-center gap-4 m-24">
            <div className="flex h-0 absolute  flex-col items-center justify-end">
                <XpPopup xpPopupValue={xpPopupValue} />
            </div>
            {auth.user ?
                userData ? (<div>
                    <LevelBar xp={userData?.xp} />
                </div>) : (
                    <div className="grid grid-cols-1 grid-rows-1">
                        <div className="backdrop-blur-sm grid-center" />
                        <LevelBar className="grid-center m-4" xp={2561} />
                    </div>
                )
                : (
                    <div className="grid grid-cols-1 grid-rows-1">
                        <div className="backdrop-blur-sm grid-center flex items-center justify-center">
                            <h2>
                                Sign in to track your progress
                            </h2>
                        </div>
                        <LevelBar className="grid-center m-4" xp={2561} />
                    </div>
                )}
            <GamePanel vnData={vnData} checkAnswer={checkAnswer} />
            <div className="flex w-[40rem] p-1 h-12 items-center justify-center gap-3">
                {lastRounds.map((round: any, id: number) => {
                    return (
                        <div key={id} className="group inline-block w-fit">
                            <div className="w-0 absolute h-0 flex-col justify-end hidden group-hover:flex">
                                <div className="absolute -translate-x-[50%] hidden group-hover:flex flex-col pb-6 gap-3 w-[30rem]">
                                    <div className="panel">
                                        <Image className="rounded-xl h-full w-auto" src={round.screenshot} alt={""} width={1000} height={500} />
                                        <p className="text-white pt-6">
                                            {round.title}
                                        </p>
                                        <p>
                                            {round.alttitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {round.pass ? (
                                <div className="bg-green-600 select-none rounded-full text-xs w-4 h-4 flex items-center justify-center">✓</div>
                            ) : (
                                <div className="bg-red-600 select-none rounded-full text-xs  w-4 h-4 flex items-center justify-center">X</div>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                    <p>
                        Current streak:
                    </p>
                    <div className="flex items-center gap-2">
                        <h2>
                            {streak}
                        </h2>
                        <StreakBadge streak={streak} />
                    </div>
                </div>
                <p className="text-sm text-neutral-500">
                    {"Displaying vns with " + Math.floor(10000 / (1 + streak / 2)).toString().toString() + " votecount and over"}
                </p>
                <p className="text-sm text-neutral-500">
                    {"Current XP multiplier: " + Math.ceil(calculateXpReward(42000, streak) * 10) / 10 + "X"}
                </p> 
            </div>
        </main >
    );
}