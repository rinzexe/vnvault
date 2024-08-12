'use client'

import { createClient } from "@/utils/supabase/client";

export default function Profile() {
    const supabase = createClient();

    // Handle file upload event
    const uploadFile = async (event: any) => {
        const file = event.target.files[0];
        const bucket = "documents"

        console.log(await supabase.storage.listBuckets())

        // Call Storage API to upload file
        const { data, error } = await supabase.storage.from("user_profiles").upload(file.name, file);

        // Handle error if upload failed
        if (error) {
            console.log(error)
            alert('Error uploading file.');
            return;
        }

        alert('File uploaded successfully!');
    };

    return (
        <div>
            <h1>Upload Profile Photo</h1>
            <input accept="image/png, image/gif, image/jpeg" type="file" onChange={uploadFile} />
        </div>
    );
}