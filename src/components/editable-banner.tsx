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

interface BannerProps {
  currentImageUrl: string
}

export default function Banner({ currentImageUrl }: BannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [scale, setScale] = useState(1)
  const editorRef = useRef<AvatarEditor>(null)

  const auth = useAuth()
  const isMe = currentImageUrl.includes(auth.user?.id!)
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
      const scaledCanvas = document.createElement('canvas')
      scaledCanvas.width = 1000
      scaledCanvas.height = 400
      const ctx = scaledCanvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, 1000, 400)
        try {
          const jpgBlob = await convertToJpg(scaledCanvas)
          const file = new File([jpgBlob], "banner-image.jpg", { type: "image/jpeg" })
          const publicUrl = await auth.db.users.updateBanner(file, auth.user.id)
          toast({
            title: "Success",
            description: "Banner image updated successfully. Reload page to see changes.",
          })
          setIsOpen(false)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update banner image",
            variant: "destructive",
          })
        }
      }
    }
  }

  const renderBannerImage = () => (
    <img
      src={currentImageUrl}
      alt="Banner image"
      className="object-cover w-full h-full"
    />
  )

  const renderEditableContent = () => (
    <>
      {renderBannerImage()}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Camera className="w-8 h-8 text-white" />
      </div>
    </>
  )

  if (!isMe) {
    return (
      <div className="relative w-full h-48 overflow-hidden">
        {renderBannerImage()}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-full h-48 overflow-hidden !p-0"
        >
          {renderEditableContent()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Banner Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            {image ? (
              <div className="w-full max-h-[60vh] overflow-hidden">
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={1000}
                  height={400}
                  border={50}
                  color={[255, 255, 255, 0.6]}
                  scale={scale}
                  rotate={0}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            ) : (
              <div className="w-full aspect-[5/2] bg-muted flex items-center justify-center">
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
            <Button variant="outline" onClick={() => document.getElementById("bannerFileInput")?.click()}>
              Choose File
            </Button>
            <input
              id="bannerFileInput"
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