"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"
import { type Accept, useDropzone } from "react-dropzone"
import { Canvas } from "fabric"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { useWindow } from "@/hooks/use-window"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
// import { ScrollArea } from "./ui/scroll-area"
import { otherFonts, recommendedFonts } from "@/lib/constants"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { selectedTextPropertiesProps } from "@/hooks/use-fabric"
import { AnimatePresence, motion } from "framer-motion"
import { ImageSelector } from "./image-selector"

interface ToolbarProps {
  setBackgroundImage: (imageUrl: string) => Promise<Canvas | null>
  addText: () => void
  addImage: (imagePath: string) => void
  changeFontFamily: (fontFamily: string) => void
  changeTextColor: (color: string) => void
  flipImage: (direction: "horizontal" | "vertical") => void
  deleteSelectedObject: () => void
  downloadCanvas: () => void
  changeBackgroundColor: (color: string) => void
  currentBackgroundColor: string
  selectedTextProperties: selectedTextPropertiesProps
  toggleFilter: () => void
  isImageSelected: boolean
  hasCanvasChanged: boolean
  hasObjects: boolean
}

export function Toolbar({
  setBackgroundImage,
  addText,
  addImage,
  changeFontFamily,
  changeTextColor,
  flipImage,
  deleteSelectedObject,
  downloadCanvas,
  changeBackgroundColor,
  currentBackgroundColor,
  selectedTextProperties,
  toggleFilter,
  isImageSelected,
  hasCanvasChanged,
  hasObjects,
}: ToolbarProps) {
  const [isImageSelectorOpen, setIsImageSelectorOpen] = React.useState(false)

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const dataUrl = URL.createObjectURL(acceptedFiles[0])
        setBackgroundImage(dataUrl).catch((error) => {
          console.error("Error setting background image:", error)
        })
      }
    },
    [setBackgroundImage],
  )

  const accept: Accept = {
    "image/*": [".jpg", ".jpeg", ".png"],
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  })

  const { isMobile } = useWindow()

  return (
    <div className="max-w-[100vw] px-5">
      <div className="no-scrollbar w-full overflow-x-auto rounded-full border bg-white border-gray-200 transition-colors duration-200 sm:overflow-visible">
        <div className="flex items-center gap-2 p-2 text-2xl md:justify-center">
          <Button
            {...getRootProps()}
            variant="outline"
            size="icon"
            className="rounded-full hover:animate-jelly shrink-0"
          >
            <input {...getInputProps()} />
            <Icons.background className="size-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:animate-jelly shrink-0"
                style={{ backgroundColor: currentBackgroundColor }}
              />
            </PopoverTrigger>
            <PopoverContent
              className="mt-3 w-fit p-0 rounded-lg bg-transparent"
              align="start"
            >
              <HexColorPicker
                className="border-none"
                color={currentBackgroundColor}
                onChange={(color: string) => {
                  return changeBackgroundColor(color)
                }}
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => setIsImageSelectorOpen(true)}
            variant="outline"
            size="icon"
            className="rounded-full hover:animate-jelly shrink-0"
          >
            <Icons.stickers className="size-5" />
          </Button>
          <ImageSelector
            isOpen={isImageSelectorOpen}
            onClose={() => setIsImageSelectorOpen(false)}
            onSelectImage={(imagePath) => {
              addImage(imagePath)
              setIsImageSelectorOpen(false)
            }}
          />
          <AnimatePresence>
            {isImageSelected && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.09 } }}
                transition={{
                  duration: 0.1,
                  stiffness: 900,
                  type: "spring",
                  damping: 50,
                }}
                className="flex items-center gap-2"
              >
                <Button
                  onClick={() => flipImage("horizontal")}
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:animate-jelly shrink-0"
                >
                  <Icons.flip className="size-4" />
                </Button>
                <Button
                  onClick={() => toggleFilter()}
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:animate-jelly shrink-0"
                >
                  <Icons.filters className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={addText}
            variant="outline"
            size="icon"
            className="rounded-full hover:animate-jelly shrink-0"
          >
            <Icons.text className="size-4" />
          </Button>
          <AnimatePresence>
            {selectedTextProperties.isTextSelected && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.09 } }}
                transition={{
                  duration: 0.1,
                  stiffness: 900,
                  type: "spring",
                  damping: 50,
                }}
                className="flex items-center gap-2"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:animate-jelly shrink-0"
                    >
                      <Icons.font className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="max-w-[200px] w-full p-0 h-[250px] rounded-lg bg-white text-gray-900"
                    sideOffset={5}
                  >
                    <Command className="bg-white">
                      <CommandInput 
                        placeholder="Search font family" 
                        className="text-gray-900 border-gray-200"
                      />
                      <CommandList>
                        <CommandEmpty className="text-gray-500">
                          No font family found.
                        </CommandEmpty>
                        <CommandGroup heading={
                          <span className="text-gray-500">
                            Recommended
                          </span>
                        }>
                          {recommendedFonts.map((font) => (
                            <CommandItem
                              key={font}
                              onSelect={() => changeFontFamily(font)}
                              className="cursor-pointer text-gray-900 hover:bg-gray-100"
                            >
                              <button 
                                className="flex w-full items-center text-gray-900"
                                onClick={() => changeFontFamily(font)}
                              >
                                <span style={{ fontFamily: font }}>
                                  {font}
                                </span>
                                {selectedTextProperties.fontFamily === font && (
                                  <CheckIcon className="ml-auto h-4 w-4 text-black" />
                                )}
                              </button>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandGroup heading={
                          <span className="text-gray-500">
                            Others
                          </span>
                        }>
                          {otherFonts.map((font) => (
                            <CommandItem
                              key={font}
                              onSelect={() => changeFontFamily(font)}
                              className="cursor-pointer text-gray-900 hover:bg-gray-100"
                            >
                              <button 
                                className="flex w-full items-center text-gray-900"
                                onClick={() => changeFontFamily(font)}
                              >
                                <span style={{ fontFamily: font }}>
                                  {font}
                                </span>
                                {selectedTextProperties.fontFamily === font && (
                                  <CheckIcon className="ml-auto h-4 w-4 text-black" />
                                )}
                              </button>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:animate-jelly shrink-0"
                      style={{
                        backgroundColor: selectedTextProperties.fontColor,
                      }}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    className="mt-3 w-fit p-0 rounded-lg bg-transparent"
                    align="start"
                  >
                    <HexColorPicker
                      className="border-none"
                      color={selectedTextProperties.fontColor}
                      onChange={(color: string) => {
                        return changeTextColor(color)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={deleteSelectedObject}
            variant="outline"
            size="icon"
            className={`rounded-full shrink-0 ${
              !hasObjects && 'opacity-40 cursor-not-allowed hover:animate-none'
            }`}
            disabled={!hasObjects}
          >
            <Icons.trash className={`size-4 ${hasObjects ? 'text-red-600' : 'text-gray-400'}`} />
          </Button>
          <Button
            onClick={downloadCanvas}
            variant="outline"
            size="icon"
            className={`rounded-full hover:animate-jelly shrink-0 ${
              !hasCanvasChanged && 'opacity-50 cursor-not-allowed hover:animate-none'
            }`}
            disabled={!hasCanvasChanged}
          >
            <Icons.download className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
