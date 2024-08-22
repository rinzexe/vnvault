import Image from "next/image";
import PlayCard from "./play/play-card";

export default function Home() {

  return (
    <main className="flex flex-col gap-8 items-center ">
      <div className="panel p-0 grid grid-cols-1 hover:border-neutral-700 duration-300 grid-rows-1">
        <video src={"/challenge bg.webm"} loop muted autoPlay playsInline className="w-full brightness-[15%] duration-300 col-start-1 col-end-1 row-start-1 row-end-1 rounded-xl h-full" />
        <div className="col-start-1 col-end-1 row-start-1 row-end-1 z-10 flex p-8 flex-col justify-center pointer-events-none">
          <h1>
            VVVault
          </h1>
          <p>
            Your go-to place for everything visual novels
          </p>
        </div>
      </div>
      <div>
        <h1>
          Recent updates
        </h1>
      </div>
      <img src="/vnvlogo.png" alt="logo" width={500} height={500} />
    </main>
  );
}
