import BarChart from "@/app/_components/charts/bar-chart";
import PieChart from "@/app/_components/charts/pie-chart";
import Headers from "@/app/_components/table/headers";
import Row from "@/app/_components/table/row";
import Table from "@/app/_components/table/table";
import { Stats } from "../../[slug]/client-page";
import getStatusName from "@/consts/status";

export default function VNStats({ stats }: { stats: Stats }) {


    return (
        <div className="flex flex-col items-center gap-12">
            <div className='w-full flex lg:flex-row flex-col gap-4 items-center '>
                <div className="grid grid-cols-1 grid-rows-1 items-center align-middle justify-items-center relative">
                    <div className="absolute flex flex-col gap-0 justify-center items-center bottom-0 top-0 left-0 right-0 w-full h-full">
                        <h1>
                            {stats.totalVnsInList}
                        </h1>
                        <p className="text-xs text-neutral-500">
                            Novels in vault
                        </p>
                    </div>
                    <PieChart data={stats.vaultStats} />
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
                    <PieChart data={stats.genreStats} />
                </div>
            </div>
            <div className="h-[30rem] w-full flex flex-col items-center gap-4">
                <h1>
                    Rating distribution
                </h1>
                <div className="flex flex-col lg:flex-row w-full pr-10 lg:pr-0 h-full gap-4 justify-between items-center">
                    <BarChart data={stats.ratingStats} />
                    <div className=" flex flex-row lg:flex-col justify-between lg:justify-center gap-4 w-max min-w-48 ">
                        <div>
                            <h2>
                                Rated vns
                            </h2>
                            <p>
                                {stats.ratedVns}
                            </p>
                        </div>
                        <div>
                            <h2>
                                Average rating
                            </h2>
                            <p>
                                {stats.averageRating}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}