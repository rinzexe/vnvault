'use client'

import Image from "next/image";
import PlayCard from "./play-card";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col gap-8 items-center p-24">
      <PlayCard />
    </main>
  );
}
