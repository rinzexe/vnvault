import Link from "next/link";
import RatingBadge from "../rating-badge";
import { getVaultStatusText } from "@/utils/vault";
import EditSVG from "../svgs/edit";
import Avatar from "@/app/leaderboard/avatar";

interface RowProps {
    href: string
    iconUrl?: string
    fields: any[]
    title: string
    subtitle?: string
    editingCallback?: any
    avatarUser?: any
    numbered?: boolean
    roundIcons?: boolean
}

export default function Row({ href, title, subtitle, iconUrl, fields, editingCallback, avatarUser, numbered, ...props }: RowProps) {
    return (
        <div {...props} className="w-full">
            {fields ? (
                <div className="flex items-center gap-4 hover:bg-white/10 hover:cursor-pointer p-2 rounded-lg duration-300">
                    <Link className="flex-grow" href={href} >
                        <div className="flex lg:grid  lg:grid-cols-2 w-full  items-center gap-4 select-none ">
                            <div className="flex flex-grow gap-4 items-center">
                                {iconUrl ?
                                    <img src={iconUrl} alt="" width={50} height={50} />
                                    :
                                    avatarUser ? (
                                        <></>
                                    ) : (
                                        <div className="w-[50px]">
                                        </div>
                                    )
                                }
                                {avatarUser && !iconUrl && (
                                    <Avatar user={avatarUser} />
                                )}
                                <div>
                                    <p className="text-white">{title}</p>
                                    {subtitle && <p className="">{subtitle}</p>}
                                </div>
                            </div>
                            <div
                                style={{ gridTemplateColumns: "repeat(" + (window.innerWidth > 1024 ? fields.length : 1) + ", minmax(0, 1fr))" }}
                                className="grid  gap-4 lg:w-full h-full items-center">
                                {fields.map((field: any, id: number) => (
                                    <div className="lg:flex flex-row items-center hidden last:flex justify-center last:!justify-end text-center" key={id}>
                                        {field}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Link>
                    {editingCallback && (
                        <div onClick={editingCallback} className="group w-fit hidden lg:flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10">
                            <h4 className="duration-300 group-hover:text-blue-500 group-hover:font-bold">
                                Edit
                            </h4>
                            <EditSVG className="w-8 h-8 pl-2 stroke-white  stroke-2 group-hover:stroke-[3px]  group-hover:stroke-blue-500 duration-300" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-[50px]">
                </div>
            )
            }
        </div>
    )
}