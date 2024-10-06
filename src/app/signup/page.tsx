"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function SignUpPage() {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const auth = useAuth()

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setError("")

        try {
            await auth.signUp(formData)
            router.push("/") // Redirect to home page after successful sign-up
        } catch (err) {
            setError("An error occurred during sign-up. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Sign up to start using VNVault
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="flex items-center flex-col gap-2 w-full">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="panel w-full py-1 px-2 text-xs"
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="panel w-full py-1 px-2 text-xs"
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="panel w-full py-1 px-2 text-xs"
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button className="mt-5 w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        Already have an account? <a href="/signin" className="underline">Sign in</a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}