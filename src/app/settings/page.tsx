"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Upload, Image as ImageIcon, FileText, Star, Trash2, BookOpen, Clock, BarChart2, Activity, Settings, Sliders, Loader } from "lucide-react"
import FavoriteEditModal from "@/components/favorite-edit-modal"
import { IUser, IUserSettings } from "@/types/user"
import ProfilePicture from "@/components/editable-avatar"
import Banner from "@/components/editable-banner"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile")
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [nsfwEnabled, setNsfwEnabled] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState("")
    const [bannerPreview, setBannerPreview] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const { toast } = useToast()
    const router = useRouter()
    const auth = useAuth()

    useEffect(() => {
        async function fetchData() {
            if (auth.user) {
                setIsLoading(true)
                try {
                    const res = await auth.db.users.getUserById(auth.user.id!)
                    setUsername(res.username || "")
                    setBio(res.bio || "")
                    setNsfwEnabled(res.nsfwEnabled || false)
                    setAvatarPreview(res.avatarUrl || "")
                    setBannerPreview(res.bannerUrl || "")
                } catch (error) {
                    console.error("Failed to fetch user data:", error)
                    toast({
                        title: "Error",
                        description: "Failed to load user data. Please try again.",
                        variant: "destructive",
                    })
                } finally {
                    setIsLoading(false)
                }
            }
        }

        fetchData()
    }, [auth.user, toast])

    const handleSaveChanges = async () => {
        try {
            if (auth.user?.id) {
                await auth.db.users.updateUser(auth.user.id, {
                    username,
                    bio,
                    nsfw_enabled: nsfwEnabled,
                })
                toast({
                    title: "Settings updated",
                    description: "Your settings have been successfully updated.",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update settings. Please try again.",
                variant: "destructive",
            })
        }
    }

    // Check if user is logged in
    if (!auth.user) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Settings</h1>
                <p className="">Not logged in. You must log in in order to change your preferences.</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 flex items-center justify-center h-screen">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p className="text-lg">Loading settings...</p>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case "account":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Manage your account details</CardDescription>
                        </CardHeader>
                        {/*                         <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </CardContent> */}
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
                )
            case "preferences":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Manage your app preferences</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="nsfw-mode"
                                    checked={nsfwEnabled}
                                    onCheckedChange={setNsfwEnabled}
                                />
                                <Label htmlFor="nsfw-mode">Enable NSFW Content</Label>
                            </div>
                        </CardContent>
                    </Card>
                )
            case "profile":
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your profile details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Avatar</CardTitle>
                                <CardDescription>Upload or change your avatar</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {avatarPreview && <ProfilePicture currentImageUrl={avatarPreview} />}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Banner</CardTitle>
                                <CardDescription>Upload or change your profile banner</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {bannerPreview && <Banner currentImageUrl={bannerPreview} />}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Favorites</CardTitle>
                                <CardDescription>Manage your favorite visual novels and characters</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2 items-center">
                                    <Label>Favorite Visual Novels</Label>
                                    <FavoriteEditModal
                                        type="vn"
                                        username={username}
                                    />
                                </div>
                                <div className="flex gap-4 items-center">
                                    <Label>Favorite Characters</Label>
                                    <FavoriteEditModal
                                        type="character"
                                        username={username}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 space-y-2">
                    <Button
                        variant={activeTab === "profile" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("profile")}
                    >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Button>
                    <Button
                        variant={activeTab === "preferences" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("preferences")}
                    >
                        <Sliders className="mr-2 h-4 w-4" />
                        Preferences
                    </Button>
                    <Button
                        variant={activeTab === "account" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("account")}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Account
                    </Button>
                </div>
                <div className="flex-1">
                    {renderContent()}
                    <div className="mt-6 flex justify-between items-center">
                        <Button onClick={handleSaveChanges}>Save All Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}