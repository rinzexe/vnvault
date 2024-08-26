import Link from "next/link"

interface VNCardProps {
    title: string
    alttitle: string
    imageUrl?: string
    href: string
    fields?: any[]
}

export default function VNCard({ title, alttitle, imageUrl, href, fields, ...props }: VNCardProps) {
    return (
        <Link {...props} href={href} className="justify-start h-full flex-col lg:min-w-[0px] min-w-[300px] flex gap-2">
            {imageUrl && <img className="rounded-xl" src={imageUrl} alt="" width="300" height="300" />}
            <div>
                <h2>
                    {title}
                </h2>
                <p>
                    {alttitle}
                </p>
                {fields && fields.map((field: any, id: number) => {
                    return (
                        <>
                            {field}
                        </>
                    )
                })}
            </div>
        </Link>
    )
}