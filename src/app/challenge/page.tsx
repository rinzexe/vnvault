'use client'

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getAutofillSuggestions, getRandomPanel } from "./actions";
import { useAuth } from "../_components/auth-provider";
import XpPopup from "./xp-popup";
import LevelBar from "../_components/level-bar";
import StreakBadge from "../_components/streak-badge";
import GamePanel from "./game-panel";

export interface VnData {
    screenshot: string
    title: string
    alttitle: string
}

export default function Challenge() {
    const [vnData, setVnData] = useState<VnData | undefined>()
    const [lastRounds, setLastRounds] = useState<any>([])
    const [xpPopupValue, setXpPopupValue] = useState<number>(0)
    const [userData, setUserData] = useState<any>(0)

    const auth = useAuth()

    useEffect(() => {
        setVnData(undefined)
        async function getVnData() {
            const gotVnData: VnData = await getRandomPanel(getStreak())

            const userData = await auth.getUserData(auth.user.id)

            setUserData(userData)
            setVnData(gotVnData)
        }

        getVnData()
    }, [lastRounds])

    function getStreak() {
        var streak = 0
        var streakBroken = false
        var incr = 1
        while (lastRounds.length > 0 && streakBroken == false) {
            if (lastRounds[lastRounds.length - incr] && lastRounds[lastRounds.length - incr].pass) {
                streak++
            }
            else {
                streakBroken = true
            }
            incr++
        }

        return streak
    }

    function checkAnswer(answerTitle: string) {
        if (answerTitle === vnData?.title) {
            if (lastRounds.length > 10) {
                setLastRounds([...lastRounds, { pass: true, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }].slice(1))
            }
            else {
                setLastRounds([...lastRounds, { pass: true, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }])
            }

            const streak = getStreak()

            if (auth.user != null) {
                auth.updateStats(auth.user.id, streak, true, vnData).then((xpValue: number) => {
                    setXpPopupValue(xpValue)
                })
            }
        }
        else {
            if (lastRounds.length > 10) {
                setLastRounds([...lastRounds, { pass: false, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }].slice(1))
            }
            else {
                setLastRounds([...lastRounds, { pass: false, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }])
            }

            if (auth.user != null) {
                auth.updateStats(auth.user.id, 0, false, vnData)
            }
        }
    }

    return (
        <main className="flex flex-col items-center gap-4 m-24">
            <div className="flex h-0 absolute  flex-col items-center justify-end">
                <XpPopup xpPopupValue={xpPopupValue} />
            </div>
            {auth.user ? (
                <div>
                    <LevelBar xp={userData?.xp} />
                </div>
            ) : (
                <div>
                    Sign in to see xp features
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
            <div className="flex items-center gap-3">
                <p>
                    Current streak:
                </p>
                <div className="flex items-center gap-2">
                    <h2>
                        {getStreak()}
                    </h2>
                    <StreakBadge streak={getStreak()} />
                </div>
            </div>
        </main>
    );
}