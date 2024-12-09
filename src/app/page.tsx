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
    hasObjects,
  } = useFabric()

  return (
    <div className="min-h-screen">
      <div className="px-2 pt-6 md:pt-16 min-h-screen flex flex-col bg-white text-black">
        <div className="flex-none flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="border rounded-3xl overflow-hidden shadow-lg h-[60vh] w-auto md:h-auto"
          />
        </div>
        <div className="flex-none mt-8 md:mt-12 space-y-6 flex items-center flex-col">
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
            hasObjects={hasObjects}
          />
        </div>
      </div>
    </div>
  )
}
