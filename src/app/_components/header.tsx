import Link from "next/link";

export default function Header() {
    return (
        <div className="flex flex-row justify-center w-full p-8">
            <Link className="select-none" href="/">
                <h1>
                    VNVault
                </h1>
            </Link>
        </div>
    )
}