import { useEffect, useRef, useState } from "react"
import AccentButton from "./accent-button"

export default function ExpandableSection({ children }: any) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const containerRes = useRef<any>()
    const openRef = useRef<any>()
    const closeRes = useRef<any>()

    useEffect(() => {
        if (isOpen) {
            containerRes.current.classList.remove('max-h-[45rem]')
            containerRes.current.classList.remove('overflow-hidden')
            openRef.current.classList.add('hidden')
        }
        else if (!isOpen) {
            containerRes.current.classList.add('max-h-[45rem]')
            containerRes.current.classList.add('overflow-hidden')
            openRef.current.classList.remove('hidden')
        }
    }, [isOpen])

    return (
        <div ref={containerRes} className="max-h-[45rem] overflow-hidden duration-500 relative">
            <div ref={openRef}>
                <div className="absolute w-full h-full bg-transparent z-10" />
                <div className="absolute w-full h-5/6 bottom-0 flex flex-col items-center justify-end p-8 bg-gradient-to-t from-black to-transparent z-10">
                    <AccentButton onClick={() => setIsOpen(!isOpen)}>
                        <h3 className="px-3 py-1">
                            View all
                        </h3>
                    </AccentButton>
                </div>
            </div>
            {children}
            <div className="flex flex-col items-center justify-end p-8">
                <AccentButton onClick={() => setIsOpen(!isOpen)}>
                    <h3 className="px-3 py-1">
                        Close
                    </h3>
                </AccentButton>
            </div>
        </div>
    )
}