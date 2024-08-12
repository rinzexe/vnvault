'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FileUpload from "../_components/file-upload";
import { getAutofillSuggestions, getRandomPanel } from "./actions";

const suggestionPlaceholders = [
    "Song of Saya",
    "Tsukihime",
    "Fate/Stay Night",
    "CLANNAD",
    "Steins;Gate",
    "Higurashi",
    "Umineko",
    "Muv-Luv",
    "Little Busters",
    "Chaos;Head",
    "Chaos;Child",
]

function getRandomSuggestionPlaceholder() {
    return suggestionPlaceholders[Math.floor(Math.random() * suggestionPlaceholders.length)]
}

export interface VnData {
    screenshot: string
    title: string
    alttitle: string
}

export default function Challenge() {
    const [vnData, setVnData] = useState<VnData | undefined>()
    const [suggestions, setSuggestions] = useState<any>([])
    const [lastRounds, setLastRounds] = useState<any>([])

    const lastInput = useRef<number>(0)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setVnData(undefined)
        async function getVnData() {
            const gotVnData: VnData = await getRandomPanel()

            setVnData(gotVnData)
        }

        getVnData()
    }, [lastRounds])

    function completeSuggestions() {
        const time = new Date().getTime()

        if (inputRef.current && inputRef.current.value == "") {
            setSuggestions([])
        }
        else if (time - lastInput.current > 500 && inputRef.current) {
            getAutofillSuggestions(inputRef.current.value).then((res) => {
                setSuggestions(res)
            })
        }
    }

    function onInputChange() {
        const time = new Date().getTime()

        lastInput.current = time
        setTimeout(completeSuggestions, 501)
    }

    function checkAnswer(answerTitle: string) {
        inputRef.current ? inputRef.current.value = "" : ""
        setSuggestions([])
        if (answerTitle === vnData?.title) {
            setLastRounds([...lastRounds, { pass: true, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }])
        }
        else {
            setLastRounds([...lastRounds, { pass: false, title: vnData?.title, alttitle: vnData?.alttitle, screenshot: vnData?.screenshot }])
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-8 p-24">
            <div className="flex flex-col items-center relative mb-6">
                <div className="h-[40rem] w-auto flex flex-col items-center justify-center">
                    {vnData ? (
                        <Image className="rounded-xl h-full w-auto" src={vnData.screenshot} alt={vnData.title} width={1000} height={500} />
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </div>
                <div className="flex h-0 absolute -bottom-6 flex-col items-center justify-end">
                    <div style={{ gridAutoRows: "repeat(" + suggestions.length + ", minmax(0, 1fr))" }} className="grid bottom-0 m-2 w-[40rem] gap-4 panel p-2 empty:hidden">
                        {suggestions.map((suggestion: any, id: number) => {
                            return (
                                <div key={id} onClick={() => { checkAnswer(suggestion.title) }} className="flex flex-row hover:bg-white/10 p-2 rounded-lg items-center gap-4 select-none hover:cursor-pointer">
                                    <Image src={suggestion.image.url} alt={suggestion.title} width={50} height={50} />
                                    <div>
                                        <p className="text-white">{suggestion.title}</p>
                                        <p className="">{suggestion.alttitle}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-[40rem] flex flex-row gap-2">
                        <input onSubmit={() => { console.log("submit") }} placeholder={getRandomSuggestionPlaceholder()} ref={inputRef} onChange={() => { onInputChange() }} className="panel px-4 py-2 focus:outline-none flex-grow" type="text" />
                        <button className="panel px-4 py-2" onClick={() => checkAnswer("")}>Skip</button>
                    </div>
                </div>
            </div>
            <div className="inline-block w-[40rem] p-1 items-center gap-2">
                {lastRounds.map((round: any, id: number) => {
                    return (
                        <div key={id} className="group inline-block w-fit p-1">
                            <div className="w-0 absolute hidden group-hover:flex pt-8">
                                <div className="absolute -translate-x-[50%] hidden group-hover:flex panel flex-col gap-3 w-[30rem]">
                                    <Image className="rounded-xl h-full w-auto" src={round.screenshot} alt={round.title} width={1000} height={500} />
                                    <p className="text-white">
                                        {round.title}
                                    </p>
                                    <p>
                                        {round.title}
                                    </p>
                                </div>
                            </div>
                            {round.pass ? (
                                <div className="bg-green-600 select-none rounded-full w-6 h-6 flex items-center justify-center">✓</div>
                            ) : (
                                <div className="bg-red-600 select-none rounded-full w-6 h-6 flex items-center justify-center">X</div>
                            )}
                        </div>
                    )
                })}
            </div>
        </main>
    );
}