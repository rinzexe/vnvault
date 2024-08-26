import Image from "next/image";
import PlayCard from "./play/play-card";
import ClientPage from "./client-page";

export default function Home() {

  return (
    <main className="flex flex-col gap-8 items-center ">
      <ClientPage />
    </main>
  );
}
