import React, { useState, useRef, useEffect } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvas-preview'
import { useDebounceEffect } from './use-debounce-effect'

import 'react-image-crop/dist/ReactCrop.css'
import { useAuth } from '@/app/_components/auth-provider'
import AccentButton from '@/app/_components/accent-button'
import { useRouter } from 'next/navigation'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function AvatarUploadModal(file: any) {
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    setCrop(undefined) // Makes crop preview update between images.
    const reader = new FileReader()
    reader.addEventListener('load', () =>
      setImgSrc(reader.result?.toString() || ''),
    )
    reader.readAsDataURL(file.file)
  }, [file])

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  async function onDownloadCropClick() {
    setIsUploading(true)
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    )

    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    })

    auth.updateAvatar(blob, auth.user.id).then(() => {
      router.replace('/profile')
    })
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {

        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop
        )
      }
    },
    100,
    [completedCrop],
  )

  return (
    <div className="panel p-0 relative">
      {isUploading && (
        <div className='absolute w-full h-full flex items-center justify-center bg-black/75 backdrop-blur-md rounded-lg z-[60]'>
          <h1>
            Loading...
          </h1>
        </div>
      )}
      <div className='p-4'>
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            // minWidth={400}
            minHeight={100}
          // circularCrop
          >
            <img
              className='rounded-lg w-96'
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
        {!!completedCrop && (
          <div className='flex flex-col items-center gap-4'>
            <div>
              <canvas
                ref={previewCanvasRef}
                className='hidden'
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div>
              <AccentButton onClick={onDownloadCropClick}>Set avatar</AccentButton>
              <a
                href="#hidden"
                ref={hiddenAnchorRef}
                download
                style={{
                  position: 'absolute',
                  top: '-200vh',
                  visibility: 'hidden',
                }}
              >
                Hidden download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
