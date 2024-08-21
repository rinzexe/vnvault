'use client'

import AccentButton from "../_components/accent-button"
import { useAuth } from "../_components/auth-provider"

export default function SignUp() {
    const auth = useAuth()
    return (
        <div className="w-full flex items-center flex-col">
            <h1 className="mb-8">
                Create an account
            </h1>
            <form className="flex items-center flex-col gap-2 w-[20rem]">
                <label htmlFor="email">Username:</label>
                <input className="panel w-full py-1 px-2 text-xs" id="username" name="username" type="username" required />
                <label htmlFor="email">Email:</label>
                <input className="panel w-full py-1 px-2 text-xs" id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input className="panel w-full py-1 px-2 text-xs" id="password" name="password" type="password" required />
                <AccentButton className="mt-5" formAction={async (formData: any) => {
                    const res = await auth.signUp(formData)
                }}>Sign up</AccentButton>
            </form>
        </div>
    )
}