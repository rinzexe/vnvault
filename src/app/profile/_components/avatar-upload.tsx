'use client'

import { createClient } from "@/utils/supabase/client";
import { useAuth } from "../../_components/auth-provider";
import { createPortal } from "react-dom";
import { useState } from "react";
import AvatarUploadModal from "./avatar-upload-modal";


export default function AvatarUpload({ children }: any) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [file, setFile] = useState<any>(null);

    const supabase = createClient();

    const auth = useAuth()

    const modalContent: any = document.getElementById('modal-content');

    function startEditing(file: any) {
        setFile(file)
        setIsEditing(true);
        //updateAvatar(event, auth.user.id)
    }

    return (
        <div className="relative h-full flex-shrink-0 w-48">
            {modalContent && isEditing && createPortal((
                <div className="absolute w-full h-full flex items-center justify-center bg-black/75 z-50">
                    <div onClick={() => { setIsEditing(false) }} className="absolute w-full h-full">
                    </div>
                    <AvatarUploadModal file={file} />
                </div>
            ), modalContent)}
            {children}
            <div className="w-full h-full absolute bottom-0 right-0 left-0 top-0 group">
                <input className="opacity-0 w-full h-full duration-300 absolute hover:cursor-pointer group" accept="image/jpeg" type="file" onChange={(event) => event.target.files && startEditing(event.target.files[0])} />
                <div className="opacity-0 duration-300 group-hover:opacity-100 flex items-center justify-center w-full h-full absolute rounded-full pointer-events-none group-hover:bg-black/50">
                    <svg className="feather feather-edit" fill="none" height="36" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
            </div>
        </div>
    );
}