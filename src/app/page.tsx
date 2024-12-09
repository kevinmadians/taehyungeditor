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
    isDarkMode,
    toggleDarkMode,
    hasCanvasChanged,
  } = useFabric()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className={`px-2 space-y-10 min-h-screen items-center h-full flex-col flex justify-between transition-colors duration-200 ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-black'}`}>
        <div className="w-full flex justify-end pt-4 px-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-black'
            }`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
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
            isDarkMode={isDarkMode}
            hasCanvasChanged={hasCanvasChanged}
          />
          <div className="flex flex-col justify-center text-center items-center text-sm md:flex-row">
            <a
              className={`text-balance leading-loose font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-blue-400' 
                  : 'text-muted-foreground hover:text-blue-700'
              }`}
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
