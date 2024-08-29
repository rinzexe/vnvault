import Link from "next/link";
import RatingBadge from "../rating-badge";
import { getVaultStatusText } from "@/utils/vault";
import EditSVG from "../svgs/edit";
import Avatar from "@/app/leaderboard/avatar";
import { useTable } from "./table";
import VNCard from "../vn-card";
import ImageWithSkeleton from "../image-with-skeleton";

export interface EntryProps {
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
    cardFields?: { hover?: any, right?: any, left?: any }
    tags?: any[]
    dims?: any
    key: number
}

function CondLink({ children, href }: any) {
    if (href != undefined) {
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

export default function TableEntry({ href, title, subtitle, dims, hasIcon, iconUrl, cardFields, fields, editingCallback, avatarUser, numbered, key, actionContent, tags, ...props }: EntryProps) {

    const table = useTable()


    switch (table.get.currentType) {
        case "row": {
            return <RowEntry href={href} key={key} dims={dims} title={title} subtitle={subtitle} hasIcon={hasIcon} iconUrl={iconUrl} fields={fields} editingCallback={editingCallback} avatarUser={avatarUser} numbered={numbered} actionContent={actionContent} tags={tags} />
        }
        case "card": {
            return <CardEntry href={href} key={key} dims={dims} title={title} subtitle={subtitle} hasIcon={hasIcon} iconUrl={iconUrl} cardFields={cardFields} editingCallback={editingCallback} avatarUser={avatarUser} numbered={numbered} actionContent={actionContent} tags={tags} />
        }
    }
}

function CardEntry({ href, dims, title, subtitle, hasIcon, iconUrl, cardFields, editingCallback, avatarUser, numbered, actionContent, key, tags }: any) {
    return (
        <div className="relative">
            <div className="absolute hidden lg:block top-6 right-6 z-10">
                {actionContent}
            </div>
            <VNCard dims={dims} title={title} alttitle={subtitle} href={href} imageUrl={iconUrl} fields={[<BottomCard key={key} cardFields={cardFields} />]} />
        </div>
    )
}

function BottomCard({ cardFields }: any) {
    return (
        <div className="flex w-full items-end justify-between">
            {cardFields?.left}
            {cardFields?.right}
        </div>
    )
}

function RowEntry({ href, title, dims, subtitle, hasIcon, iconUrl, fields, editingCallback, avatarUser, numbered, actionContent, tags, ...props }: any) {
    return (
        <div {...props} className="w-full ">
            {fields ? (
                <div className="flex items-center gap-4 panel p-2 hover:bg-white/10 hover:cursor-pointer rounded-lg duration-300">
                    <CondLink href={href}>
                        <div className="flex lg:grid lg:grid-cols-2 w-full items-center gap-4 select-none ">
                            <div className="flex flex-grow gap-4 items-center">
                                {iconUrl && hasIcon ?
                                    <ImageWithSkeleton src={iconUrl} dims={dims} className="!w-14" allClassName="!rounded-md" />
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
                                    {subtitle && <p className="text-sm">{subtitle}</p>}
                                    {tags && (
                                        tags.map((tag: any, id: number) => (
                                            <p style={{ backgroundColor: tag.color }} key={id}>{tag.name}</p>
                                        ))
                                    )}
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