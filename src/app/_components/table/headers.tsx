import ChervonSVG from "../svgs/chervon";
import EditSVG from "../svgs/edit";

interface HeadersProps {
    className?: any,
    fields: string[],
    sortingCallback?: any[]
    leftPadding?: number
    sort?: any
}

export default function Headers({ className, sort, fields, sortingCallback, leftPadding, ...props }: HeadersProps) {
    return (
        <div style={{ paddingRight: leftPadding + "px" }} {...props} className="flex items-center gap-4">
            <div className={"grid select-none flex-grow p-2 grid-cols-2 gap-4 *:text-sm " + className}>
                <div className={"flex items-center"}>
                    <div className={["w-max flex items-center", sortingCallback && sortingCallback[0] && 'hover:cursor-pointer'].join(' ')}>
                        <p onClick={sortingCallback && sortingCallback[0] && sortingCallback[0]} className="text-sm text-neutral-500">
                            Name
                        </p>
                        {sort && sort.type == 0 && (
                            <ChervonSVG
                                className={!sort.asc ?
                                    "!stroke-neutral-500 w-5 " :
                                    "!stroke-neutral-500 w-5 -scale-100"
                                } />
                        )}
                    </div>
                </div>
                <div
                    style={{ gridTemplateColumns: "repeat(" + fields.length + ", minmax(0, 1fr))" }} className="grid gap-4 h-full items-center ">
                    {fields.map((field: string, id: number) => (
                        <div key={id} className={"flex flex-row items-center justify-center last:!justify-end"}>
                            <div className={["w-max flex items-center", sortingCallback && sortingCallback[id + 1] && 'hover:cursor-pointer'].join(' ')}>
                                <p
                                    onClick={sortingCallback && sortingCallback[id + 1] && sortingCallback[id + 1]}
                                    className="text-center text-neutral-500">
                                    {field}
                                </p>
                                {sort && sort.type == id + 1 && (
                                    <ChervonSVG
                                        className={!sort.asc ?
                                            "!stroke-neutral-500 w-5 " :
                                            "!stroke-neutral-500 w-5 -scale-100"
                                        } />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}