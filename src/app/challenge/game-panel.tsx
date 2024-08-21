import Image from "next/image"
import { getAutofillSuggestions, getRandomPanel } from "./actions";
import { useEffect, useRef, useState } from "react"
import FeedbackPopup from "./feedback-popup";
import { getRandomSuggestionPlaceholder } from "@/utils/placeholders";

export default function GamePanel({ vnData, checkAnswer, lastRounds, answerChecked }: any) {
    const [suggestions, setSuggestions] = useState<any>([])

    const lastInput = useRef<number>(0)

    const inputRef = useRef<any>()

    function onInputChange() {
        const time = new Date().getTime()

        lastInput.current = time
        setTimeout(completeSuggestions, 501)
    }

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

    return (
        <div className="flex flex-col min-h-[20rem] w-full items-center relative mb-6">
            <div className="lg:h-[50dvh] min-h-[20rem] lg:w-auto w-full flex flex-col relative items-center justify-center">
                <FeedbackPopup lastRounds={lastRounds} />
                {vnData && answerChecked == true ? (
                    <img style={{ filter: "blur(12px) brightness(25%)" }} className="rounded-xl h-full w-auto" src={lastRounds[lastRounds.length - 1].screenshot} alt={""} width={1000} height={500} />
                ) : (
                    vnData ? (
                        <img onLoad={(e: any) => { e.target.classList.remove("opacity-0") }} className="rounded-xl h-full w-auto opacity-0" src={vnData.screenshot} alt={vnData.title} width={1000} height={500} />
                    ) : (
                        <h1>Loading...</h1>
                    )

                )}
            </div>
            <div className="flex h-0 absolute w-full px-2 lg:px-0 -bottom-6 flex-col items-center justify-end z-10">
                <div style={{ gridAutoRows: "repeat(" + suggestions.length + ", minmax(0, 1fr))" }} className="grid bottom-0 m-2 w-full lg:w-[40rem] gap-2 panel p-2 empty:hidden">
                    {suggestions.map((suggestion: any, id: number) => {
                        return (
                            <div key={id} onClick={() => { inputRef.current.value = ""; setSuggestions([]); checkAnswer(suggestion.title) }} className="flex flex-row hover:bg-white/10 p-2 rounded-lg items-center gap-4 select-none hover:cursor-pointer">
                                <img src={suggestion.image.url} alt="" width={50} height={50} />
                                <div>
                                    <p className="text-white">{suggestion.title}</p>
                                    <p className="">{suggestion.alttitle}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="lg:w-[40rem] w-full flex flex-row gap-2">
                    <input placeholder={getRandomSuggestionPlaceholder()} ref={inputRef} onChange={() => { onInputChange() }} className="panel px-4 py-2 focus:outline-none flex-grow" type="text" />
                    <button className="panel px-4 py-2" onClick={() => { inputRef.current.value = ""; setSuggestions([]); checkAnswer("") }}>Skip</button>
                </div>
            </div>
        </div >
    )
}