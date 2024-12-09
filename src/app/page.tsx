"use client"

import { Toolbar } from "@/components/toolbar"
import { useFabric } from "@/hooks/use-fabric"
import "@/app/fonts.css"

export default function HomePage() {
  const {
    canvasRef,
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
  } = useFabric()

  return (
    <div className="min-h-screen">
      <div className="px-2 pt-3 md:pt-16 min-h-screen flex flex-col bg-white text-black">
        <div className="flex-1 flex items-center justify-center max-h-[75vh] md:max-h-none">
          <canvas
            ref={canvasRef}
            className="border rounded-3xl overflow-hidden shadow-lg max-h-full w-auto"
          />
        </div>
        <div className="py-2 md:py-4 space-y-2 md:space-y-4 flex items-center flex-col">
          <Toolbar
            setBackgroundImage={setBackgroundImage}
            addText={addText}
            addImage={addImage}
            changeFontFamily={changeFontFamily}
            changeTextColor={changeTextColor}
            flipImage={flipImage}
            deleteSelectedObject={deleteSelectedObject}
            downloadCanvas={downloadCanvas}
            changeBackgroundColor={changeBackgroundColor}
            currentBackgroundColor={currentBackgroundColor}
            selectedTextProperties={selectedTextProperties}
            toggleFilter={toggleFilter}
            isImageSelected={isImageSelected}
            hasCanvasChanged={hasCanvasChanged}
          />
          <div className="flex flex-col justify-center text-center items-center text-xs md:text-sm md:flex-row">
            <a
              className="text-balance leading-none font-medium text-muted-foreground hover:text-blue-700"
              href="https://x.com/kvinms97"
              target="_blank"
            >
              Built by Kevin
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
