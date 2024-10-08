import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth } from './auth-provider';

interface INSFWImageProps {
    imageUrl: string;
    resolution: number[];
    isNsfw: boolean;
    className?: string;
    showAdvancedNsfwMessage?: boolean;
}

export default function NSFWImage({
    imageUrl,
    resolution,
    isNsfw,
    className,
    showAdvancedNsfwMessage = false,
    ...props
}: INSFWImageProps) {
    const [isBlurred, setIsBlurred] = useState(isNsfw);
    const [nsfwEnabled, setNsfwEnabled] = useState(false)

    const handleUnblur = () => {
        setIsBlurred(false);
    };

    const auth = useAuth()

    useEffect(() => {
        async function fetchData() {
            if (auth.user) {
                const res = await auth.db.users.getUserInfoById(auth.user.id)
                console.log(res)
                if (res.nsfw_enabled == true) {
                    setNsfwEnabled(true)
                    setIsBlurred(false)
                }
            }
        }
        fetchData()
    }, [])

    return (
        <div className="relative">
            <img
                src={imageUrl}
                {...props}
                width={resolution[0]}
                height={resolution[1]}
                className={`transition-opacity ${className} rounded duration-300 ${isBlurred ? 'blur-sm opacity-25' : 'opacity-100'}`}
                style={{ filter: isBlurred ? 'blur(10px)' : 'none', padding: isBlurred ? "10px" : "" }}
            />
            {isNsfw && isBlurred && !nsfwEnabled && (
                <div
                    className="absolute w-full h-full gap-2 flex flex-col justify-center items-center top-0 left-0 text-white p-2 rounded"
                >
                    {showAdvancedNsfwMessage ? (
                        <>
                            <p className="text-center text-foreground mb-2 text-sm">
                                NSFW content is disabled by default. You can change your preferences in <Link className='underline' href={"/settings/"}>settings</Link>.
                            </p>
                            <div className='flex gap-2 items-center'>
                                <Button
                                    onClick={handleUnblur}
                                    className="mb-2"
                                >
                                    Unblur Image
                                </Button>
                            </div>
                        </>
                    ) : (
                        <span className='text-foreground text-xs text-center'>NSFW</span>
                    )}
                </div>
            )}
        </div>
    );
}