'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FileUpload from "../_components/file-upload";
import { getAutofillSuggestions, getRandomPanel } from "./actions";

export interface VnData {
    screenshot: string,
    title: string
}

export default function Challenge() {
    const [vnData, setVnData] = useState<VnData>()
    const [reset, setReset] = useState(false)
    const [suggestions, setSuggestions] = useState<any>([])
    const [lastRounds, setLastRounds] = useState<any>([])

    const lastInput = useRef<number>(0)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        async function getVnData() {
            const gotVnData: VnData = await getRandomPanel()

            setVnData(gotVnData)
        }

        getVnData()
    }, [reset, lastRounds])

    function completeSuggestions() {
        const time = new Date().getTime()

        console.log(time - lastInput.current)

        if (time - lastInput.current > 500 && inputRef.current && inputRef.current.value.length > 2) {
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
            setLastRounds([...lastRounds, { pass: true }])
        }
        else {
            setLastRounds([...lastRounds, { pass: false }])
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-8 p-24">
            <button onClick={() => checkAnswer("")}>Skip</button>
            {vnData ? <Image className="rounded-xl" src={vnData.screenshot} alt={vnData.title} width={1000} height={1000} /> : <h1>Loading</h1>}
            <div className="w-full flex flex-col items-center gap-4">
                <input ref={inputRef} onChange={() => { onInputChange() }} className="panel px-3 py-1" type="text" />
                <div className="w-full flex flex-col items-center">
                    <div className="absolute grid grid-rows-3 gap-4">
                        {suggestions.map((suggestion: any) => {
                            return (
                                <div onClick={() => { checkAnswer(suggestion.title) }} className="flex flex-row panel p-4 items-center gap-4 select-none hover:cursor-pointer">
                                    <Image src={suggestion.image.url} alt={suggestion.title} width={50} height={50} />
                                    <h3>{suggestion.title}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                {lastRounds.map((round: any) => {
                    return (
                        <div className="panel p-1">
                            <p>{round.pass ? "Correct" : "Incorrect"}</p>
                        </div>
                    )
                })}
            </div>
        </main>
    );
}