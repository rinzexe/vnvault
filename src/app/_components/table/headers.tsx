import ChervonSVG from "../svgs/chervon";
import EditSVG from "../svgs/edit";

interface HeadersProps {
    className?: any,
    fields: string[],
    sortingCallback?: any[]
    isEditable?: boolean
    sort?: any
}

export default function Headers({ className, sort, fields, sortingCallback, isEditable, ...props }: HeadersProps) {
    return (
        <div {...props} className="flex items-center gap-4">
            <div className={"grid select-none flex-grow p-2 grid-cols-2 gap-4 *:text-sm " + className}>
                <div className="flex items-center">
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
                <div
                    style={{ gridTemplateColumns: "repeat(" + fields.length + ", minmax(0, 1fr))" }} className="grid gap-4 h-full items-center ">
                    {fields.map((field: string, id: number) => (
                        <div key={id} className={" flex flex-row items-center justify-center last:!justify-end"}>
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
                    ))}
                </div>
            </div>
            {isEditable && (
                <div className="group !opacity-0 !select-none !pointer-events-none w-fit flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10">
                    <h4 className="duration-300 group-hover:text-blue-500 group-hover:font-bold">
                        Edit
                    </h4>
                    <EditSVG className="w-8 h-8 pl-2 stroke-white  stroke-2 group-hover:stroke-[3px]  group-hover:stroke-blue-500 duration-300" />
                </div>
            )}
        </div>
    )
}