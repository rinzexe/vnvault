import { calculateLevel } from "@/utils/levels"

export default function LevelBar({ xp, ...props }: any) {
    const xpInfo = calculateLevel(xp)
    return (
        <div {...props}>
            <h3>
                Level {xpInfo.level}
            </h3>
            <div className="flex gap-2 flex-row items-center">
                <div className="w-64 flex-grow bg-neutral-800 rounded-full h-3 flex flex-row">
                    <div className="shadow-[0px_0px_5px_rgba(59,130,255,1),0px_0px_20px_rgba(59,130,255,1),0px_0px_50px_rgba(59,130,255,1.0)] h-3 rounded-full bg-blue-500" style={{ width: `${(xpInfo.remainingXP / xpInfo.xpForNextLevel) * 100}%` }}>
                    </div>
                </div>
                <p>
                    {xpInfo.xpForNextLevel - xpInfo.remainingXP + "XP Remaining"}
                </p>
            </div>
        </div>
    )
}