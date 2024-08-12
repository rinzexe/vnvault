import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import FileUpload from '../_components/file-upload'

export default async function PrivatePage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <div>
            <FileUpload />
        </div>
    )
}