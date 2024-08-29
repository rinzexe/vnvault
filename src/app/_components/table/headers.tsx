import { useContext, useRef, useState } from "react";
import ChervonSVG from "../svgs/chervon";
import ColumnsSVG from "../svgs/columns";
import EditSVG from "../svgs/edit";
import { useTable } from "./table";
import BurgerMenuSVG from "../svgs/burdermenu";
import Dropdown from "../dropdown";

export interface HeadersProps {
    className?: any,
    fields: string[],
    sortingCallback?: any[]
    leftPadding?: number
    sort?: { type: number, asc: any }
}

export default function Headers({ className, sort, fields, sortingCallback, leftPadding, ...props }: HeadersProps) {
    const [currentOrder, setCurrentOrder] = useState<number>(sort?.type!)

    const table = useTable()

    function handleDropdownSelectType(id: number) {
        setCurrentOrder(id)
        sortingCallback && sortingCallback[id]()
    }

    function handleDropdownSelectOrder(id: number) {
        if (id != sort?.asc) {
            sortingCallback && sortingCallback[currentOrder]()
        }
    }

    var dropdownData: any = [{ name: 'Name', id: 0 }]
    if (sortingCallback) {
        fields.forEach((field: string, id: number) => {
            if (sortingCallback[id + 1]) {
                dropdownData.push({ name: field, id: id + 1 })
            }
        })
    }

    if (table.get.currentType == "row") {
        return (
            <div>
                <div className="flex flex-row justify-end w-full  *:hover:cursor-pointer ">
                    {table.get.acceptedTypes.card && table.get.acceptedTypes.row &&
                        (
                            <>
                                {
                                    table.get.acceptedTypes.card && (
                                        <ColumnsSVG onClick={() => table.set({ ...table.get, currentType: "card" })} className="fill-neutral-400 hover:fill-white duration-300 h-8" />
                                    )
                                }
                                {
                                    table.get.acceptedTypes.row && (
                                        <BurgerMenuSVG onClick={() => table.set({ ...table.get, currentType: "row" })} className="stroke-neutral-400 hover:stroke-white duration-300 h-8" />
                                    )
                                }
                            </>
                        )
                    }
                </div>
                <div style={{ paddingRight: leftPadding + "px" }} {...props} className="flex items-center gap-4">
                    <div className={"grid select-none flex-grow p-2 grid-cols-2 gap-4 *:text-sm " + className}>
                        {(sort || fields) && <div className={"flex items-center"}>
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
                        </div>}
                        <div
                            style={{ gridTemplateColumns: "repeat(" + fields.length + ", minmax(0, 1fr))" }} className="grid gap-4 h-full items-center ">
                            {fields.map((field: string, id: number) => (
                                <div key={id} className={"flex flex-row group items-center justify-center last:!justify-end"}>
                                    <div className={["w-max lg:flex hidden group-last:flex items-center", sortingCallback && sortingCallback[id + 1] && 'hover:cursor-pointer'].join(' ')}>
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
            </div>
        )
    }
    else if (table.get.currentType == "card") {
        return (
            <div className="pb-96 -mb-96">
                <div className="flex w-full mb-4 justify-between">
                    {sort && (
                        <div className="flex items-center gap-4">
                            <Dropdown
                                data={dropdownData}
                                style='bg-purple-800'
                                selectedId={sort.type}
                                onSelect={handleDropdownSelectType}
                            />
                            <Dropdown
                                data={[{ name: 'Descending', id: 0 }, { name: "Ascending", id: 1 }]}
                                style='bg-purple-800'
                                selectedId={+sort.asc}
                                onSelect={handleDropdownSelectOrder}
                            />
                        </div>
                    )}
                    {table.get.acceptedTypes.card && table.get.acceptedTypes.row &&
                        (<div className="flex flex-row justify-end w-full *:hover:cursor-pointer ">
                            {table.get.acceptedTypes.card && (
                                <ColumnsSVG onClick={() => table.set({ ...table.get, currentType: "card" })} className="fill-neutral-400 hover:fill-white duration-300 h-8" />
                            )}
                            {table.get.acceptedTypes.row && (
                                <BurgerMenuSVG onClick={() => table.set({ ...table.get, currentType: "row" })} className="stroke-neutral-400 hover:stroke-white duration-300 h-8" />
                            )}
                        </div>)
                    }
                </div>
            </div>
        )
    }
}