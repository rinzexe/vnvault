import { useEffect, useRef, useState } from "react";

export default function FeedbackPopup({ lastRounds }: any) {
    const [animating, setAnimating] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(true);
    const popupRef = useRef<any>(null);

    useEffect(() => {
        if (lastRounds.length != 0) {
            setAnimating(true)
            setTimeout(() => {
                setAnimating(false)
            }, 1500)

            if (lastRounds[lastRounds.length - 1]?.pass == true) {
                setCorrect(true)
            }
            else {
                setCorrect(false)
            }
        }
    }, [lastRounds])


    return (
        <div className="top-0 bottom-0 left-0 right-0 absolute flex justify-center items-center z-30 select-none pointer-events-none">
            {animating && (
                correct ? (
                    <div className="w-20 h-20 rounded-full bg-green-500 flex justify-center items-center text-3xl animate-feedbackPopup 
                        shadow-[0px_0px_20px_rgba(34,197,94,1),0px_0px_40px_rgba(34,197,94,1),0px_0px_80px_rgba(34,197,94,1.0)]">
                        ✓
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-full bg-red-500 flex justify-center items-center text-3xl animate-feedbackPopup 
                    shadow-[0px_0px_20px_rgba(239,68,68,1),0px_0px_40px_rgba(239,68,68,1),0px_0px_80px_rgba(239,68,68,1.0)]">
                        X
                    </div>
                )
            )}
        </div>
    )
}