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
      <div className="px-2 pt-10 md:pt-16 space-y-10 min-h-screen items-center h-full flex-col flex justify-between bg-white text-black">
        <canvas
          ref={canvasRef}
          className="border rounded-3xl overflow-hidden shadow-lg"
        />
        <div className="pt-10 pb-8 space-y-5 flex items-center flex-col">
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
          <div className="flex flex-col justify-center text-center items-center text-sm md:flex-row">
            <a
              className="text-balance leading-loose font-medium text-muted-foreground hover:text-blue-700"
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
