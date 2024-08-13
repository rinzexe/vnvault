import { useEffect, useRef, useState } from "react";

export default function FeedbackPopup({ correct }: any) {
    const [animating, setAnimating] = useState<boolean>(false);
    const popupRef = useRef<any>(null);

    useEffect(() => {
        if (correct > 0) {
            setAnimating(true)
        }
    }, [correct])


    return (
        <div>
            
        </div>
    )
}