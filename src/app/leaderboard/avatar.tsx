import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "../_components/auth-provider"

export default function Avatar({ user }: any) {
    const [avatar, setAvatar] = useState<string | null>(null)

    const auth = useAuth()

    useEffect(() => {
        async function fetchAvatar() {
            const userData = await auth.getUserData(user.id)
            const avatar = await auth.getAvatar(userData)
            setAvatar(avatar.data.publicUrl)
        }

        fetchAvatar()
    }, [])

    return (
        <div className="h-12 w-12">
            {avatar && <img className="rounded-full w-12 h-12" alt="" width="50" height="50" src={avatar} />}
        </div>
    )
}