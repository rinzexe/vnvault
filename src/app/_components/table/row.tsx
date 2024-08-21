import Link from "next/link";
import RatingBadge from "../rating-badge";
import { getVaultStatusText } from "@/utils/vault";
import EditSVG from "../svgs/edit";
import Avatar from "@/app/leaderboard/avatar";

interface RowProps {
    href?: string
    iconUrl?: string
    fields: any[]
    title: string
    subtitle?: string
    editingCallback?: any
    avatarUser?: any
    numbered?: boolean
    roundIcons?: boolean
    hasIcon?: boolean
    actionContent?: any
}

export default function Row({ href, title, subtitle, hasIcon, iconUrl, fields, editingCallback, avatarUser, numbered, actionContent, ...props }: RowProps) {

    function CondLink({ children }: any) {
        if (href) {
            return <Link className="flex-grow" href={href} >{children}</Link>
        }
        else {
            return (
                <div className="flex-grow">
                    {children}
                </div>
            )
        }
    }

    console.log(iconUrl)

    return (
        <div {...props} className="w-full">
            {fields ? (
                <div  className="flex items-center gap-4 hover:bg-white/10 hover:cursor-pointer p-2 rounded-lg duration-300">
                    <CondLink>
                        <div className="flex lg:grid  lg:grid-cols-2 w-full  items-center gap-4 select-none ">
                            <div className="flex flex-grow gap-4 items-center">
                                {iconUrl && hasIcon ?
                                    <img src={iconUrl} alt="" width={50} height={50} />
                                    :
                                    avatarUser && hasIcon ? (
                                        <></>
                                    ) : (
                                        hasIcon && (
                                            <div className="w-[50px]">
                                            </div>
                                        )
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
                    </CondLink>
                    {actionContent!}
                </div>
            ) : (
                <div className="h-[50px]">
                </div>
            )
            }
        </div>
    )
}