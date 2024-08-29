import Link from "next/link";

export default function Feedback() {
    return (
        <div className="flex flex-col gap-4 items-center">
            <h1>
                Feeback
            </h1>
            <p className="max-w-96 text-center">
                This website is still under development, although now in a somewhat decent state. If you run into any bugs or have any kind of feedback at all, feel free to dm me on Twitter / X
            </p>
            <Link className="text-blue-500" href="https://x.com/rinzzexe">
                Twitter
            </Link>
        </div>
    )
}