import { createClient } from "@/utils/supabase/server";
import ClientProfile from "./client-page";

export async function generateMetadata({ params }: any) {
    const supabase = createClient()

    const res = await supabase.from('users').select('*').eq('username', params.slug)

    console.log(res)

    if (res.data) {
        const url = 'avatars/' + res.data[0].id + '.png?t=' + res.data[0].updated_at
        const pfpurl = await supabase.storage.from('user_profiles').getPublicUrl(url)
        console.log(pfpurl)
        return {
            title: res.data[0].username,
            openGraph: {
                siteName: "VNVault",
                title: res.data[0].username,
                images: [
                    {
                        url: pfpurl.data.publicUrl
                    }
                ]
            }
        }
    }
}

export default async function Profile({ params }: { params: { slug: string } }) {

    return (
        <ClientProfile params={{ slug: params.slug }} />
    );
}
