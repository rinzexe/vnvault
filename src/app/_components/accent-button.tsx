import * as React from "react"

export default function AccentButton({ children, className, ...props }: any) {
    return (
        <button {...props} className={["group w-fit flex hover:cursor-pointer items-center panel py-1 px-3 duration-300 hover:bg-white/10", className].join(' ')}>
            {children}
        </button>
    )
}
