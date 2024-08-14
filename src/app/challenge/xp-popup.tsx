'use client'

import { animate, useMotionValue, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function XpPopup({ xpPopupValue }: any) {
    const [animating, setAnimating] = useState<boolean>(false);
    const popupRef = useRef<any>(null);

    useEffect(() => {
        if (xpPopupValue > 0) {
            setAnimating(true)
        }
    }, [xpPopupValue])


    return (
        <h3 ref={popupRef} onAnimationEnd={() => setAnimating(false)} className={animating ? "animate-xpPopup text-blue-500 drop-shadow-[0_0px_5px_rgba(0,255,0,1)]" : "hidden"}>
            {"+ " + xpPopupValue + " XP"}
        </h3>
    )
}
