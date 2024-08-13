'use client'

import { createClient } from "@/utils/supabase/client";

export default function Profile() {
    const supabase = createClient();

    // Handle file upload event
    const uploadFile = async (event: any) => {
        const file = event.target.files[0];
        const bucket = "documents"

        const { data, error } = await supabase.storage.from("user_profiles").upload(file.name, file);

        if (error) {
            alert('Error uploading file.');
            return;
        }

        alert('File uploaded successfully!');
    };

    return (
        <div>
            <input accept="image/png, image/gif, image/jpeg" type="file" onChange={uploadFile} />
        </div>
    );
}