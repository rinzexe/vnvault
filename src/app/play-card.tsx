'use client'

import Link from "next/link";

export default async function PlayCard() {

    return (
        <Link href="/challenge">
            <div className="panel p-0 grid grid-cols-1 hover:border-neutral-700 duration-300 grid-rows-1">
                <video onMouseOver={(event: any) => event.target.play()} onMouseOut={(event: any) => event.target.pause()} src="/challenge bg.webm" loop muted playsInline className="w-full brightness-[15%] hover:cursor-pointer hover:brightness-[25%] duration-300 col-start-1 col-end-1 row-start-1 row-end-1 rounded-xl h-full" />
                <div className="col-start-1 col-end-1 row-start-1 row-end-1 z-10 flex p-8 flex-col justify-center pointer-events-none">
                    <h1>
                        VN Guessing challenge
                    </h1>
                    <p>
                        Test your visual novel knowledge
                    </p>
                </div>
            </div>
        </Link>
    );
}
