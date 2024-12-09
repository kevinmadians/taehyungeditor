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
  isDarkMode: boolean
}

const presetImages = [
  { path: "/chillguy.png", name: "Chill Guy" },
  { path: "/taehyung.png", name: "Taehyung 1" },
  { path: "/taehyung 2.png", name: "Taehyung 2" },
]

export function ImageSelector({ isOpen, onClose, onSelectImage, isDarkMode }: ImageSelectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            Choose an Image
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {presetImages.map((image) => (
            <button
              key={image.path}
              onClick={() => {
                onSelectImage(image.path)
                onClose()
              }}
              className={`relative group overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-gray-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.path}
                alt={image.name}
                className="w-full h-32 object-contain"
              />
              <div className={`absolute bottom-0 left-0 right-0 p-2 text-sm text-center transition-opacity ${
                isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'
              }`}>
                {image.name}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 