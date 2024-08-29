import LevelBar from "@/app/_components/level-bar";
import StatPanel from "../stat";

export default function GameStats({ userData }: any) {
    return (
        <div>
            <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 items-center gap-4">
                <LevelBar xp={userData?.xp} />
                <div className=" flex w-full justify-center lg:justify-end gap-4">
                    <div className='panel grid grid-rows-3 grid-cols-2 lg:grid-rows-2 lg:grid-cols-3 gap-3'>
                        <StatPanel title='Total XP' value={userData?.xp} symbol='' />
                        <StatPanel title='Total guesses' value={userData?.total_incorrect + userData?.total_correct} symbol='' />
                        <StatPanel title='Longest streak' value={userData?.longest_streak} symbol='' />
                        <StatPanel title='Total hits' value={userData?.total_correct} symbol='' />
                        <StatPanel title='Total misses' value={userData?.total_incorrect} symbol='' />
                        <StatPanel title='Hit %' value={Math.round(userData?.total_correct / (userData?.total_incorrect + userData?.total_correct) * 1000) / 10} symbol='%' />
                    </div>
                </div>
            </div>
        </div>
    )
}