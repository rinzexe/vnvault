import BarChart from "@/app/_components/charts/bar-chart";
import PieChart from "@/app/_components/charts/pie-chart";
import Headers from "@/app/_components/table/headers";
import Row from "@/app/_components/table/table-entry";
import Table from "@/app/_components/table/table";
import { Stats } from "../../[slug]/client-page";
import getStatusName from "@/consts/status";
import StatPanel from "../stat";

export default function VNStats({ stats }: { stats: Stats }) {


    return (
        <div className="flex flex-col lg:grid grid-cols-2 gap-12">
            <div className=" w-full flex flex-col gap-12">
                <div className="panel grid gap-4 grid-cols-2 ">
                    <StatPanel title='Average rating given ' value={Math.round(stats.averageRating * 10) / 10} symbol='' />
                    <StatPanel title='Total rated vns' value={stats.ratedVns} symbol='' />
                    <StatPanel title='Average votecount of played' value={stats.averageVotecount} symbol='' />
                    <StatPanel title='Average rating of played' value={stats.averageRatingPlayed / 10} symbol='' />
                </div>
                <h1>
                    Rating distribution
                </h1>
                <div className="flex flex-col lg:flex-row w-full h-[21rem] lg:h-[30rem] pr-10 lg:pr-0 gap-4 justify-between items-center">
                    <BarChart data={stats.ratingStats} />
                </div>
            </div>
            <div className='w-full flex flex-col gap-4 justify-between items-center '>
                <div className="grid grid-cols-1 grid-rows-1 items-center align-middle justify-items-center relative">
                    <div className="absolute flex flex-col gap-0 justify-center items-center bottom-0 top-0 left-0 right-0 w-full h-full">
                        <h1>
                            {stats.totalVnsInList}
                        </h1>
                        <p className="text-xs text-neutral-500">
                            Novels in vault
                        </p>
                    </div>
                    <div className="w-96 h-96">
                        <PieChart data={stats.vaultStats} />
                    </div>
                </div>
                <div className="grid grid-cols-1 grid-rows-1 items-center align-middle justify-items-center relative">
                    <div className="absolute flex flex-col gap-0 justify-center items-center bottom-0 top-0 left-0 right-0 w-full h-full">
                        <h1>
                            {Math.round(stats.totalMinutesRead / 60) + "h"}
                        </h1>
                        <p className="text-xs text-neutral-500">
                            Time spent reading
                        </p>
                    </div>
                    <div className="w-96 h-96">
                        <PieChart data={stats.genreStats} />
                    </div>
                </div>
            </div>
        </div>
    )
}