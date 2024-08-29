import useDelayedCallback from "@/app/_hooks/use-delayed-callback";
import Dropdown from "../dropdown"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useState } from "react";

export interface DropdownSettings {
    labels?: string[]
    selected: number
}

export interface RangeSettings {
    valueLimits: number[]
}

export interface Filter {
    callback: (newValue: any) => void
    label: string
    rangeSettings?: RangeSettings
    dropdownSettings?: DropdownSettings
    type: "dropdown" | "range"
}

export interface FilterProps {
    filters: Filter[]
    className?: string
}

export default function Filters({ filters, className }: FilterProps) {
    return (
        <div className={["md:w-64 flex flex-row md:flex-col gap-4 md:gap-2", className].join(' ')}>
            {filters.map((filter: any, id: number) => {
                switch (filter.type) {
                    case "dropdown": {
                        return (
                            <DropdownFilter key={id} id={id} filter={filter} />
                        )
                    }
                    case "range": {
                        return (
                            <Range key={id} id={id} filter={filter} />
                        )
                    }
                }
            })}
        </div>
    )
}

function Range({ id, filter }: any) {
    const [min, setMin] = useState<number>(filter.rangeSettings.valueLimits[0])
    const [max, setMax] = useState<number>(filter.rangeSettings.valueLimits[1])

    function handleChange(newValue: any) {
        setMin(newValue[0])
        setMax(newValue[1])
    }

    useEffect(() => {
        setMin(filter.rangeSettings.valueLimits[0])
        setMax(filter.rangeSettings.valueLimits[1])
    }, [])

    useDelayedCallback([min, max], () => {
        filter.callback([min, max])
    })

    return (
        <div className="w-full " key={id}>
            <p className="text-sm text-neutral-500 my-2">
                {filter.label}
            </p>
            <div className="mx-2">
                <Slider
                    trackStyle={{ background: "#ffffff" }}
                    handleStyle={{ borderColor: "#f0f0f0", boxShadow: "none" }}
                    activeDotStyle={{ borderColor: "#000000", boxShadow: "#000000" }}
                    railStyle={{background: "rgb(22,22,22)"}}
                    className="!w-[80vw] md:!w-full"
                    range
                    pushable
                    value={[min, max]}
                    min={filter.rangeSettings.valueLimits[0]}
                    max={filter.rangeSettings.valueLimits[1]}
                    step={0.1}
                    onChange={handleChange} />
            </div>
            <div className="flex justify-between">
                <input
                    type="number"
                    min={filter.rangeSettings.valueLimits[0]}
                    max={filter.rangeSettings.valueLimits[1]}
                    onChange={(e: any) => { if (e.target.value <= filter.rangeSettings.valueLimits[1] && e.target.value >= filter.rangeSettings.valueLimits[0] && max > e.target.value) { setMin(e.target.value); } }}
                    className="bg-transparent w-min !outline-none text-sm text-neutral-500"
                    value={min} />
                <input
                    type="number"
                    min={filter.rangeSettings.valueLimits[0]}
                    max={filter.rangeSettings.valueLimits[1]}
                    onChange={(e: any) => { if (e.target.value <= filter.rangeSettings.valueLimits[1] && e.target.value >= filter.rangeSettings.valueLimits[0] && min < e.target.value) { setMax(e.target.value); } }}
                    className="bg-transparent w-min !outline-none text-sm text-end text-neutral-500"
                    value={max} />
            </div>
        </div>
    )
}

function DropdownFilter({ id, filter }: any) {
    return (
        <div key={id}>
            <p className="text-sm text-neutral-500 my-2">
                {filter.label}
            </p>
            <Dropdown
                data={filter.dropdownSettings.labels.map((label: string, id: number) => {
                    return {
                        name: label,
                        id: id
                    }
                })}
                selectedId={filter.dropdownSettings.selected}
                onSelect={filter.callback}
            />
        </div>
    )
}