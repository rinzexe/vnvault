import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "../_components/auth-provider"

export default function Avatar({ user }: any) {
    const [avatar, setAvatar] = useState<string | null>(null)

    const auth = useAuth()

    useEffect(() => {
        async function fetchAvatar() {
            const avatar = await auth.getAvatar(user)
            console.log(avatar.data.publicUrl)
            setAvatar(avatar.data.publicUrl)
        }

        fetchAvatar()
    }, [])

    return (
        <div className="h-12 w-12">
            {avatar && <Image className="rounded-full" alt="" width="50" height="50" src={avatar} />}
        </div>
    )
}