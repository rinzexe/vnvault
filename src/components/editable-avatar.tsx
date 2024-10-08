"use client"

import { useState, useRef, ChangeEvent } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Camera, Upload } from "lucide-react"
import AvatarEditor from "react-avatar-editor"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"

interface ProfilePictureProps {
  currentImageUrl: string
}

export default function ProfilePicture({ currentImageUrl }: ProfilePictureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [scale, setScale] = useState(1)
  const editorRef = useRef<AvatarEditor>(null)

  const auth = useAuth()
  const { toast } = useToast()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0])
    }
  }

  const handleScaleChange = (value: number[]) => {
    setScale(value[0])
  }

  const convertToJpg = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Failed to convert image to JPG"))
        }
      }, 'image/jpeg', 0.9) // 0.9 is the quality of the JPG (0-1)
    })
  }

  const handleSave = async () => {
    if (editorRef.current && auth.user) {
      const canvas = editorRef.current.getImageScaledToCanvas()
      try {
        const jpgBlob = await convertToJpg(canvas)
        const file = new File([jpgBlob], "profile-picture.jpg", { type: "image/jpeg" })
        const publicUrl = await auth.db.users.updateAvatar(file, auth.user.id)
        toast({
          title: "Success",
          description: "Profile picture updated successfully. Reload page to see changes.",
        })
        setIsOpen(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update profile picture",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-32 h-32 rounded-full overflow-hidden !p-0"
        >
          <img
            src={currentImageUrl}
            alt="Profile picture"
            className="object-cover rounded-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            {image ? (
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={250}
                height={250}
                border={50}
                borderRadius={125}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
              />
            ) : (
              <div className="w-64 h-64 bg-muted flex items-center justify-center rounded-full">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          {image && (
            <Slider
              min={1}
              max={2}
              step={0.01}
              value={[scale]}
              onValueChange={handleScaleChange}
              className="w-full"
            />
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => document.getElementById("fileInput")?.click()}>
              Choose File
            </Button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={handleSave} disabled={!image || !auth.user}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}