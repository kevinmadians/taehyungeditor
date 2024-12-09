import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImageSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (imagePath: string) => void
}

const presetImages = [
  { path: "/chillguy.png", name: "Chill Guy" },
  { path: "/taehyung.png", name: "Taehyung 1" },
  { path: "/taehyung 2.png", name: "Taehyung 2" },
]

export function ImageSelector({ isOpen, onClose, onSelectImage }: ImageSelectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Choose a Sticker
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 py-4">
          {presetImages.map((image) => (
            <button
              key={image.path}
              onClick={() => {
                onSelectImage(image.path)
                onClose()
              }}
              className="relative aspect-square p-2 flex items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105 bg-gray-50"
            >
              <img
                src={image.path}
                alt={image.name}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 