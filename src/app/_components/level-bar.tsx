import { calculateLevel } from "@/utils/levels"

export default function LevelBar({ xp, ...props }: any) {
    const xpInfo = calculateLevel(xp)
    return (
        <div className="w-full" {...props}>
            <h3>
                Level {xpInfo.level}
            </h3>
            <div className="flex gap-2 flex-col mt-2">
                <div className="w-full flex-grow bg-neutral-800 rounded-full h-3 flex flex-row">
                    <div className="min-w-[5%] shadow-[0px_0px_5px_rgba(59,130,255,1),0px_0px_20px_rgba(59,130,255,1),0px_0px_50px_rgba(59,130,255,1.0)] h-3 rounded-full bg-blue-500" style={{ width: `${(xpInfo.remainingXP / xpInfo.xpForNextLevel) * 100}%` }}>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <p>
                        {xpInfo.remainingXP + " XP"}
                    </p>
                    <p>
                        {xpInfo.xpForNextLevel - xpInfo.remainingXP + " XP"}
                    </p>
                </div>
            </div>
        </div>
    )
}