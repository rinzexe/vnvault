import * as React from "react"

export default function AccentButton({ children, ...props }: any) {
    return (
        <button {...props} className="panel w-fit h-fit rounded-md text-white border-none
        shadow-[0_0_6px_0px_rgba(255,255,255,0.5),inset_0_0_10px_0px_rgba(255,255,255,0.3)] px-3 py-2 font-bold hover:bg-white/10 duration-300">
            {children}
        </button>
    )
}

 