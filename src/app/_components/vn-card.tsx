import Link from "next/link"
import ImageWithSkeleton from "./image-with-skeleton"

interface VNCardProps {
    title: string
    alttitle: string
    imageUrl?: string
    href: string
    fields?: any[]
    dims?: number[]
}

export default function VNCard({ title, alttitle, imageUrl, href, fields, dims, ...props }: VNCardProps) {
    return (
        <Link {...props} href={href} className="justify-start w-full h-full flex-col panel p-2 lg:p-4 hover:bg-white/10 duration-300 flex gap-2">
            {imageUrl && dims ? (
                <ImageWithSkeleton src={imageUrl} dims={dims} />
            ) : (
                imageUrl && <img className="rounded-xl" src={imageUrl} alt="" width={"300"} height={"300"} />
            )}
            <div>
                <h2>
                    {title}
                </h2>
                <p>
                    {alttitle}
                </p>
                {fields && fields.map((field: any, id: number) => {
                    return (
                        <div key={id}>
                            {field}
                        </div>
                    )
                })}
            </div>
        </Link>
    )
}