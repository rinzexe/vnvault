import Image from "next/image";
import PlayCard from "./play/play-card";

export default function Home() {


  return (
    <main className="flex flex-col gap-8 items-center lg:p-24">
      <div>
        <h1 className="py-0 text-center">
          VNVault
        </h1>
        <p>
          Your go-to place for everything visual novels
        </p>
      </div>
      <img src="/vnvlogo.png" alt="logo" width={500} height={500} />
    </main>
  );
}
