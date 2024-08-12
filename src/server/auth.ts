'use server'

import { revalidatePath } from 'next/cache'
import { permanentRedirect, redirect } from 'next/navigation'



export async function signIn(formData: FormData, supabase: any) {

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        permanentRedirect('/error')
    }

    revalidatePath('/', 'layout')
    permanentRedirect('/')
}

export async function signUp(formData: FormData, supabase: any) {

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        permanentRedirect('/error')
    }

    revalidatePath('/', 'layout')
    permanentRedirect('/profile')
}

export async function signOut(supabase: any) {
    await supabase.auth.signOut()
    permanentRedirect('/')
}
