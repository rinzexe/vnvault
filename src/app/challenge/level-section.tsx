import { animate, useMotionValue, motion } from "framer-motion";
import { useAuth } from "../_components/auth-provider"
import XpPopup from "./xp-popup"
import { useEffect, useState } from "react";
import LevelBar from "../_components/level-bar";
import { calculateXpReward } from "@/utils/levels";

export default function LevelSection({ userData, xpPopupValue, streak }: any) {
    const auth = useAuth()
    return (
        <div className="flex w-full lg:w-auto flex-row items-center gap-4 h-24">
            <div className="relative min-w-64 flex-grow flex flex-col items-center">
                <div className="flex h-0 top-0 absolute flex-col items-center justify-end">
                    <XpPopup xpPopupValue={xpPopupValue} />
                </div>
                <LevelBar xp={userData?.xp} />
            </div>
            <div className="flex flex-col gap-2 h-full justify-center">
                <p className="text-xs text-neutral-500 text-center">
                    XP Multiplier:
                </p>
                <Stat value={Math.ceil(calculateXpReward(42000, streak))} />
            </div>
        </div>
    )
}



function Stat({ value }: { value: number }) {
    const [prevValue, setPrevValue] = useState<string>("0");

    useEffect(() => {
        setPrevValue(("00000" + value).substring(("00000" + value).split('').length - 6));
    }, [value])

    const valueArray = ("00000" + value).split('').slice(-6);

    const color = Math.round(Math.max((255 - value * 4 / 0.4538461), 59)) + "," + Math.round(Math.max(255 - value * 4, 130)) + "," + "255"

    return (
        <div className="flex justify-center">
            <div className="flex flex-col flex-wrap justify-center content-center"
            >
                <div className="w-full flex content-center justify-center mx-auto h-min">
                    <div
                        style={{
                            color: "rgb(" + color + ")"
                        }}
                        className="flex flex-row items-center content-center justify-center text-center h-min font-display text-4xl z-10 relative mix-blend-difference">
                        {valueArray.map((i: any, id: number) => {
                            if (!valueArray.slice(0, id + 1).every((value: any) => value == 0)) {
                                return (
                                    <div key={id} className="relative w-[22px] h-[36px] overflow-hidden">
                                        {[...Array(10).keys()].map((u, index) => {
                                            return (
                                                <Number key={index} number={u} prev={parseInt(valueArray[id])} target={i} />
                                            )
                                        })}
                                    </div>
                                )
                            }
                        })}
                        <h1>
                            X
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Number({ number, target, prev, ...props }: { number: number, target: number, prev: number }) {

    var value = useMotionValue(48 * number - 48 * prev);
    var targetY = 48 * number - 48 * target;

    useEffect(() => {
        animate(value, targetY, { duration: 3 });
    }, [value, targetY]);

    return (
        <motion.span
            {...props}
            style={{ y: value }}
            className="absolute inset-0 flex justify-center h-[48px]"
        >
            <h1>
                {number}
            </h1>
        </motion.span>
    );
}
