'use client'

import Image from "next/image";
import PlayCard from "./play-card";

export default function Home() {

  return (
    <main className="flex lg:flex-row flex-col gap-8 lg:justify-center w-full items-center lg:p-24">
      {window.innerWidth > 1024 ? 
      <PlayCard title="VN Guessing challenge" description="Guess the visual novel's name based on the provided screenshot" bgSrc="/challenge bg.webm" href="/challenge" /> :
      <PlayCard title="VN Guessing challenge" description="PC Only. Mobile soon" bgSrc="/challenge bg.webm" href="/play" />
      }
      <PlayCard title="Leaderboard" description="See where you place on the global leaderboard" bgSrc="/leaderboard bg.webm" href="/leaderboard" />
    </main>
  );
}
