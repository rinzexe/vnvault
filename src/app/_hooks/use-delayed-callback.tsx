import { useEffect, useRef } from "react";

export default function useDelayedCallback(dependencies: any[], callback: () => void) {
    const lastChange = useRef<number>(0)
    const lastDependencies = useRef<any>()
    const firstUpdate = useRef<boolean>(true);

    function completeSuggestions() {
        const time = new Date().getTime()
        if (time - lastChange.current > 500) {
            callback()
        }
    }

    useEffect(() => {
        if (firstUpdate.current == true) {
            firstUpdate.current = false
        }
        else if (JSON.stringify(lastDependencies.current) != JSON.stringify(dependencies)) {
            const time = new Date().getTime()

            lastChange.current = time
            setTimeout(completeSuggestions, 501)

        }
        lastDependencies.current = dependencies
    }, [dependencies])
}