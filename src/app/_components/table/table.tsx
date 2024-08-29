import { createContext, useContext, useEffect, useState } from "react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import TableEntry, { EntryProps } from "./table-entry"
import Headers, { HeadersProps } from "./headers"
import Filters, { FilterProps } from "./filters"

interface TableContextProps {
    get?: any
    set?: any
    acceptedTypes: { card: boolean, row: boolean }
    currentType: "card" | "row"
}

interface TableProps {
    className?: string
    isLoading: boolean
    acceptedTypes: { card: boolean, row: boolean }
    headers?: HeadersProps
    entries: EntryProps[]
    filters?: FilterProps
}

const defaultValues: TableContextProps = {
    acceptedTypes: { card: false, row: true },
    currentType: "card"
}

const TableContext = createContext(defaultValues)

export default function Table({ className, isLoading, acceptedTypes, headers, entries, filters }: TableProps) {
    const [getContext, setContext] = useState<TableContextProps>({ ...defaultValues, acceptedTypes })

    const context = { get: getContext, set: setContext }

    useEffect(() => {
        if (acceptedTypes.card == false) {
            context.set({ ...context.get, currentType: "row" })
        }
    }, [])

    const entryArray = entries?.map((entry: EntryProps, id: number) => {
        return (
            <TableEntry
                {...entry}
                key={id}
            />
        )
    })

    return (
        <TableContext.Provider value={context as any}>
            <div className="flex md:flex-row flex-col w-full gap-4">
                <div className="flex flex-col order-2 md:order-1 gap-2 h-max max-w-page w-full">
                    <div className="overflow-x-auto pb-96 -mb-96 no-scrollbar">
                        {headers && <Headers {...headers} />}
                    </div>
                    {(
                        <>
                            {context.get.currentType == "card" && (
                                <CardWrapper isLoading={isLoading} >
                                    {entryArray && entryArray}
                                </CardWrapper>
                            )}
                            {context.get.currentType == "row" && (
                                <RowWrapper isLoading={isLoading}>
                                    {entryArray && entryArray}
                                </RowWrapper>
                            )}
                        </>
                    )}
                </div>
                {filters && <Filters className="order-1 md:order-2 pb-96 -mb-96 overflow-x-auto no-scrollbar" {...filters} />}
            </div>
        </TableContext.Provider>
    )
}

function RowWrapper({ isLoading, className, children }: any) {
    return (
        <div style={{ direction: "revert" }} className={["flex gap-4 max-w-page flex-col w-full", className].join(' ')}>
            {
                isLoading ? (
                    <>
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                        <Skeleton height={"70px"} baseColor="#191919" highlightColor="#303030" />
                    </>
                ) : (
                    <>
                        {children}
                    </>
                )
            }
        </div>
    )
}

function CardWrapper({ isLoading, className, children }: any) {
    return (
        <div style={{ direction: "revert" }} className={[" max-w-page w-full", className].join(' ')}>
            <div className="hidden lg:grid grid-cols-4 gap-4 max-w-page w-full">
                {
                    isLoading ? (
                        <>
                            <div className="flex flex-col gap-4 flex-nowrap h-full w-full">
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                            </div>
                            <div className="flex flex-col gap-4 flex-nowrap h-full w-full">
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                            </div>
                            <div className="flex flex-col gap-4 flex-nowrap h-full w-full">
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                            </div>
                            <div className="flex flex-col gap-4 flex-nowrap h-full w-full">
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                            </div>
                        </>
                    ) : (
                        <>
                            {[0, 1, 2, 3].map((iteration: number) => {
                                return (
                                    <div key={iteration} className="flex flex-col gap-4 flex-nowrap h-full">
                                        {children.map((child: any, id: number) => {
                                            if (id % 4 == iteration) {
                                                return (
                                                    <div key={id}>
                                                        {child}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                )
                            })
                            }
                        </>
                    )
                }
            </div>
            <div className="lg:hidden grid grid-cols-2 gap-2 max-w-page w-full">
                {
                    isLoading ? (
                        <>
                            <div className="flex flex-col gap-2 flex-nowrap h-full w-full">
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                            </div>
                            <div className="flex flex-col gap-2 flex-nowrap h-full w-full">
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                                <Skeleton height={250 + Math.random() * 200} width="100%" baseColor="#191919" highlightColor="#303030" />
                            </div>
                        </>
                    ) : (
                        <>
                            {[0, 1].map((iteration: number) => {
                                return (
                                    <div key={iteration} className="flex flex-col gap-2 flex-nowrap h-full">
                                        {children.map((child: any, id: number) => {
                                            if (id % 2 == iteration) {
                                                return (
                                                    <div key={id}>
                                                        {child}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                )
                            })
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}

export const useTable = () => {
    return useContext(TableContext);
};