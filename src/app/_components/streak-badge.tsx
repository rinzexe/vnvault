import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function StreakBadge({ streak }: any) {
    function Badge() {
        if (streak >= 20) {
            return <Badge5 />
        }
        if (streak >= 10) {
            return <Badge4 />
        }
        if (streak >= 5) {
            return <Badge3 />
        }
        if (streak >= 2) {
            return <Badge2 />
        }

        return <Badge1 />

    }

    return (
        <div className="flex flex-row items-center gap-2">
            <Badge />
        </div>
    )

}

function Badge1() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#8d8f8e" stroke="#8d8f8e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="z-[1] -mt-1"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
    )
}

function Badge2() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#8d8f8e" stroke="#8d8f8e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="fill-orange-500 stroke-orange-400 z-[1] -mt-1"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
    )
}

function Badge3() {
    return (
        <div className="w-8 h-14 overflow-hidden">
            <DotLottieReact loop autoplay className="w-20 h-48 -translate-x-6 -translate-y-16" src="https://lottie.host/546ee641-4222-477c-84d9-ff2ac3ebd72c/Ks7zyHpYxU.json" />
        </div>
    )
}

function Badge4() {
    return (
        <div className="w-8 h-14 overflow-hidden">
            <DotLottieReact loop autoplay className="w-20 h-48 -translate-x-6 -translate-y-16" src="https://lottie.host/c5d9c878-8b61-4a67-b8f1-2083a366049d/RegyS3Ys8x.json" />
        </div>
    )
}

function Badge5() {
    return (
        <div className="w-8 h-14 overflow-hidden">
            <DotLottieReact loop autoplay className="w-20 h-48 -translate-x-6 -translate-y-16" src="https://lottie.host/4fc83826-f245-416d-bb32-1a1bfb4c838f/YGIiCT8gO8.json" />
        </div>
    )
}