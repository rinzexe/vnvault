import { useAuth } from '@/components/auth-provider';
import { useState, useEffect } from 'react';

export default function useIsMe(username: string): boolean {
    const [isMe, setIsMe] = useState<boolean>(false);

    const auth = useAuth()

    useEffect(() => {
        async function fetchData() {
            const userProfileData = await auth.db.users.getUserInfoByName(username)
            if (userProfileData.id == auth.user?.id!) {
                setIsMe(true)
            }
        }

        fetchData()
    }, [username]);

    return isMe;
}
