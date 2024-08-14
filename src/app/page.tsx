'use client'

import Image from "next/image";
import PlayCard from "./play-card";

export default function Home() {

  return (
    <main className="flex flex-col gap-8 items-center lg:p-24">
      <PlayCard />
      <Image src="/vnvlogo.png" alt="logo" width={500} height={500} />
    </main>
  );
}
