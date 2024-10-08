"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function SettingsPage() {
    const [newUsername, setNewUsername] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [nsfwEnabled, setNsfwEnabled] = useState(false)

    const { toast } = useToast()
    const router = useRouter()
    const auth = useAuth()

    useEffect(() => {
        async function fetchData() {
            if (auth.user) {
                const res = await auth.db.users.getUserInfoById(auth.user.id!)
                setNsfwEnabled(res.nsfw_enabled)
            }
        }

        fetchData()
    }, [auth.user]) // Added auth.user as a dependency

    // Check if user is logged in
    if (!auth.user) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Settings</h1>
                <p className="">Not logged in. You must log in in order to change your preferences.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Username</CardTitle>
                        <CardDescription>Update your username</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-username">New Username</Label>
                            <Input
                                id="new-username"
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => auth.db.users.updateUsername(auth.user?.id!, newUsername)}>Change Username</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>NSFW Content</CardTitle>
                        <CardDescription>Manage NSFW content visibility</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="nsfw-mode"
                                checked={nsfwEnabled}
                                onCheckedChange={() => {setNsfwEnabled(!nsfwEnabled); auth.db.users.updateUser(auth.user?.id!, {nsfw_enabled: !nsfwEnabled})}}
                            />
                            <Label htmlFor="nsfw-mode">Enable NSFW Content</Label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Delete Account</CardTitle>
                        <CardDescription>Permanently delete your account and all associated data</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => auth.db.users.deleteUser(auth.user?.id!)}>
                                        Yes, delete my account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}