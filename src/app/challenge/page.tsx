'use client'

import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import { getAutofillSuggestions, getRandomPanel } from "./actions";
import { useAuth } from "../_components/auth-provider";
import XpPopup from "./xp-popup";
import LevelBar from "../_components/level-bar";
import StreakBadge from "../_components/streak-badge";
import GamePanel from "./game-panel";
import { calculateXpReward } from "@/utils/levels";
import { animate, useMotionValue, motion } from "framer-motion";
import LevelSection from "./level-section";

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
    const [answerChecked, setAnswerChecked] = useState<boolean>(false)

    const auth = useAuth()

    useEffect(() => {
        setAnswerChecked(true)
        async function getVnData() {
            var timeElapsed = Date.now()

            const timeout = setTimeout(() => {
                setVnData(undefined)
            }, 1500)

            const gotVnData: VnData = await getRandomPanel(streak)

            if (Date.now() - timeElapsed <= 1500) {
                clearTimeout(timeout)
                await new Promise(resolve => setTimeout(resolve, 1500 - (Date.now() - timeElapsed)));
            }

            if (auth.user) {
                const userData = await auth.getUserData(auth.user?.id)
                setUserData(userData)
            }

            setAnswerChecked(false)
            setVnData(gotVnData)
        }

        getVnData()
    }, [lastRounds, setAnswerChecked])

    function checkAnswer(answerTitle: string) {
        if (answerTitle === vnData?.title) {
            setStreak(streak + 1)

            if (lastRounds.length > 10) {
                setLastRounds([...lastRounds, {
                    pass: true,
                    title: vnData?.title,
                    alttitle: vnData?.alttitle,
                    screenshot: vnData?.screenshot,
                    xpReward: Math.ceil(calculateXpReward(vnData.votecount, streak))
                }].slice(1))
            }
            else {
                setLastRounds([...lastRounds, {
                    pass: true,
                    title: vnData?.title,
                    alttitle: vnData?.alttitle,
                    screenshot: vnData?.screenshot,
                    xpReward: Math.ceil(calculateXpReward(vnData.votecount, streak))
                }])
            }

            if (auth.user != null) {
                auth.updateStats(auth.user.id, streak + 1, true, Math.ceil(calculateXpReward(vnData.votecount, streak)))
                setXpPopupValue(Math.ceil(calculateXpReward(vnData.votecount, streak)))
            }
        }
        else {
            setStreak(0)

            if (lastRounds.length > 10) {
                setLastRounds([...lastRounds, { pass: false, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot, xpReward: 0 }].slice(1))
            }
            else {
                setLastRounds([...lastRounds, { pass: false, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot, xpReward: 0 }])
            }

            if (auth.user != null) {
                auth.updateStats(auth.user.id, 0, false, 0)
            }
        }
    }

    return (
        <main className="flex lg:min-h-[calc(100vh-9rem)] relative justify-center flex-col items-center gap-4">
            {auth.user ?
                userData ? (
                    <LevelSection userData={userData} xpPopupValue={xpPopupValue} streak={streak} />

                ) : (
                    <div className="grid grid-cols-1 grid-rows-1">
                        <div className="grid-center p-2">
                            <LevelSection userData={{ xp: 2651 }} xpPopupValue={0} streak={6} />
                        </div>
                        <div className="backdrop-blur-sm grid-center z-10" />
                    </div>
                )
                : (
                    <div className="grid grid-cols-1 grid-rows-1">
                        <div className="grid-center p-2">
                            <LevelSection userData={{ xp: 2651 }} xpPopupValue={0} streak={6} />
                        </div>
                        <div className="backdrop-blur-sm grid-center z-10 flex items-center justify-center">
                            <h2>
                                Sign in to track your progress
                            </h2>
                        </div>
                    </div>
                )}
            <Timer vnData={vnData} checkAnswer={checkAnswer} answerChecked={answerChecked} />
            <GamePanel answerChecked={answerChecked} vnData={vnData} checkAnswer={checkAnswer} lastRounds={lastRounds} />
            <LastRounds lastRounds={lastRounds} />
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
                    {"Displaying vns with " + Math.floor(8000 / (1 + streak / 2)).toString().toString() + " votecount and over"}
                </p>
            </div>
        </main >
    );
}

function Timer({ vnData, checkAnswer, answerChecked }: any) {
    const [timer, setTimer] = useState<number>(0)
    const [timerSet, setTimerSet] = useState<boolean>(false)

    useEffect(() => {
        if (timerSet) {
            if (timer > 0) {
                setTimeout(() => setTimer(timer - 1), 100)
            }
            else {
                checkAnswer("")
                setTimerSet(false)
            }
        }
        if (vnData && !answerChecked && !timerSet) {
            setTimer(200)
            setTimerSet(true)
        }
        if (answerChecked) {
            setTimerSet(false)
        }
    }, [timer, setTimer, vnData, answerChecked])

    return (
        <p className="h-8">
            {timerSet && timer != 0 && timer / 10 + " s"}
        </p>
    )
}

function LastRounds({ lastRounds }: any) {
    return (
        <div className="flex w-full lg:w-[40rem] p-1 h-12 items-center justify-center gap-3">
            {lastRounds.map((round: any, id: number) => {
                return (
                    <div key={id} className="group inline-block w-fit z-20">
                        <div className="w-0 absolute h-0 flex-col justify-end hidden group-hover:flex">
                            <div className="absolute -translate-x-[50%] hidden group-hover:flex flex-col pb-6 gap-3 w-[30rem]">
                                <div className="panel">
                                    <img className="rounded-xl h-full w-auto" src={round.screenshot} alt={""} width={1000} height={500} />
                                    <div className="flex flex-row w-full justify-between pt-6 items-center">
                                        <div>
                                            <p className="text-white">
                                                {round.title}
                                            </p>
                                            <p>
                                                {round.alttitle}
                                            </p>
                                        </div>
                                        <p className="text-blue-500 w-20 text-right text-sm flex-grow">
                                            {round.xpReward > 0 && "+ " + round.xpReward + " XP"}
                                        </p>
                                    </div>

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
    )
}