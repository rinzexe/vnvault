import Image from "next/image"
import { getAutofillSuggestions, getRandomPanel } from "./actions";
import { useRef, useState } from "react"

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

export default function GamePanel({ vnData, checkAnswer }: any) {
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
        <div className="flex flex-col items-center relative mb-6">
            <div className="h-[50dvh] w-auto flex flex-col items-center justify-center">
                {vnData ? (
                    <Image className="rounded-xl h-full w-auto" src={vnData.screenshot} alt={vnData.title} width={1000} height={500} />
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>
            <div className="flex h-0 absolute -bottom-6 flex-col items-center justify-end">
                <div style={{ gridAutoRows: "repeat(" + suggestions.length + ", minmax(0, 1fr))" }} className="grid bottom-0 m-2 w-[40rem] gap-2 panel p-2 empty:hidden">
                    {suggestions.map((suggestion: any, id: number) => {
                        return (
                            <div key={id} onClick={() => { inputRef.current.value = ""; setSuggestions([]); checkAnswer(suggestion.title) }} className="flex flex-row hover:bg-white/10 p-2 rounded-lg items-center gap-4 select-none hover:cursor-pointer">
                                <Image src={suggestion.image.url} alt="" width={50} height={50} />
                                <div>
                                    <p className="text-white">{suggestion.title}</p>
                                    <p className="">{suggestion.alttitle}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="w-[40rem] flex flex-row gap-2">
                    <input placeholder={getRandomSuggestionPlaceholder()} ref={inputRef} onChange={() => { onInputChange() }} className="panel px-4 py-2 focus:outline-none flex-grow" type="text" />
                    <button className="panel px-4 py-2" onClick={() => { inputRef.current.value = ""; setSuggestions([]); checkAnswer("") }}>Skip</button>
                </div>
            </div>
        </div>
    )
}