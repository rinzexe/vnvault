import { useRef } from "react"
import Skeleton from 'react-loading-skeleton'

interface ImageWithSkeletonProps {
    dims: number[]
    src: string
    className?: string
    allClassName?: string
}

export default function ImageWithSkeleton({ dims, src, className, allClassName }: ImageWithSkeletonProps) {
    const skeletonRef = useRef<any>()

    function onLoaded() {
        console.log('loaded')
        skeletonRef.current.childNodes[0].classList.add("opacity-0")
    }
    return (
        <div className={["rounded-xl relative w-full", className].join(' ')}>
            <div className="absolute w-full h-full z-10" ref={skeletonRef}>
                <Skeleton className="h-full w-full !block !relative top-0" baseColor="#191919" highlightColor="#303030" containerClassName={["duration-500 relative top-0 block w-full bottom-0 left-0 h-full rounded-xl", allClassName].join(' ')} />
            </div>
            {/* OLD NON ANIMATED VERSION (MIGHT FALLBACK LATER) */}
            {/* <div ref={skeletonRef} className={["duration-500 bg-neutral-800 absolute w-full h-full rounded-xl", allClassName].join(' ')} /> */}
            <img src={src} width={dims[0]} height={dims[1]} className={["w-full h-full rounded-xl", allClassName].join(' ')} onLoad={onLoaded} />
        </div>
    )
}