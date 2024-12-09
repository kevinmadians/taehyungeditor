import React from "react"
import { Canvas, FabricImage } from "fabric"
import * as fabric from "fabric"
import { useWindow } from "@/hooks/use-window"
import { filterNames, getFilter } from "@/lib/constants"

interface CanvasDimensions {
  width: number;
  height: number;
  mobileMultiplier: number;
}

const CANVAS_DIMENSIONS: CanvasDimensions = {
  width: 1080,
  height: 1920,
  mobileMultiplier: 0.9
}
const DEFAULT_BACKGROUND_COLOR = "#8d927b"
const DEFAULT_FONT_COLOR = "#000000"
const DEFAULT_FONT_FAMILY = "Impact"
const DEFAULT_TEXT_OPTIONS = {
  text: "Your Text Here",
  fontSize: 40,
  fontFamily: DEFAULT_FONT_FAMILY,
  fill: DEFAULT_FONT_COLOR,
  // stroke: "black",
  // strokeWidth: 1.5,
  textAlign: "center",
}

export interface selectedTextPropertiesProps {
  fontFamily: string
  fontColor: string
  isTextSelected: boolean
}

const LIGHT_MODE_BG = "#ffffff"
const DARK_MODE_BG = "#1a1a1a"
const LIGHT_MODE_CANVAS_BG = "#8d927b"
const DARK_MODE_CANVAS_BG = "#4a4a4a"

export function useFabric() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = React.useState<Canvas | null>(null)
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false)
  const [hasCanvasChanged, setHasCanvasChanged] = React.useState<boolean>(false)
  const [hasObjects, setHasObjects] = React.useState<boolean>(false)
  const [showCenterLines, setShowCenterLines] = React.useState<boolean>(false)
  const centerLineX = React.useRef<fabric.Line | null>(null)
  const centerLineY = React.useRef<fabric.Line | null>(null)
  const [currentBackgroundColor, setCurrentBackgroundColor] = React.useState<string>(
    isDarkMode ? DARK_MODE_CANVAS_BG : LIGHT_MODE_CANVAS_BG
  )
  const [selectedTextProperties, setSelectedTextProperties] =
    React.useState<selectedTextPropertiesProps>({
      fontFamily: DEFAULT_FONT_FAMILY,
      fontColor: DEFAULT_FONT_COLOR,
      isTextSelected: false,
    })
  const [isImageSelected, setIsImageSelected] = React.useState<boolean>(false)
  const [currentFilterIndex, setCurrentFilterIndex] = React.useState<number>(0)
  const { isMobile, windowSize } = useWindow()

  // Initial canvas setup
  React.useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_DIMENSIONS.width,
      height: CANVAS_DIMENSIONS.height,
    })

    setCanvas(fabricCanvas)
    fabricCanvas.backgroundColor = currentBackgroundColor

    // Create center lines (initially hidden)
    const verticalLine = new fabric.Line([0, 0, 0, fabricCanvas.height!], {
      stroke: isDarkMode ? '#ffffff' : '#000000',
      opacity: 0.5,
      selectable: false,
      evented: false,
      visible: false,
      strokeDashArray: [4, 4],
    })

    const horizontalLine = new fabric.Line([0, 0, fabricCanvas.width!, 0], {
      stroke: isDarkMode ? '#ffffff' : '#000000',
      opacity: 0.5,
      selectable: false,
      evented: false,
      visible: false,
      strokeDashArray: [4, 4],
    })

    centerLineX.current = verticalLine
    centerLineY.current = horizontalLine
    fabricCanvas.add(verticalLine, horizontalLine)

    // Track object movement
    fabricCanvas.on('object:moving', (e) => {
      if (!e.target) return
      const obj = e.target
      const objCenter = obj.getCenterPoint()
      const canvasCenter = {
        x: fabricCanvas.width! / 2,
        y: fabricCanvas.height! / 2,
      }

      // Show center lines only when object is near center (without snapping)
      const threshold = 5
      const nearCenterX = Math.abs(objCenter.x - canvasCenter.x) < threshold
      const nearCenterY = Math.abs(objCenter.y - canvasCenter.y) < threshold

      // Show vertical line when near center X
      verticalLine.set({
        visible: nearCenterX,
        x1: canvasCenter.x,
        x2: canvasCenter.x,
        y1: 0,
        y2: fabricCanvas.height,
      })

      // Show horizontal line when near center Y
      horizontalLine.set({
        visible: nearCenterY,
        y1: canvasCenter.y,
        y2: canvasCenter.y,
        x1: 0,
        x2: fabricCanvas.width,
      })

      fabricCanvas.renderAll()
    })

    // Hide center lines when object movement ends
    const hideLines = () => {
      if (verticalLine && horizontalLine) {
        verticalLine.set({ visible: false })
        horizontalLine.set({ visible: false })
        fabricCanvas.renderAll()
      }
    }

    fabricCanvas.on('object:modified', hideLines)
    fabricCanvas.on('selection:cleared', hideLines)
    fabricCanvas.on('mouse:up', hideLines)

    // Track canvas changes
    fabricCanvas.on("object:added", () => setHasCanvasChanged(true))
    fabricCanvas.on("object:removed", () => setHasCanvasChanged(true))
    fabricCanvas.on("object:modified", () => setHasCanvasChanged(true))

    // Add a listener for when an object is added to the canvas
    fabricCanvas.on("object:added", (e) => {
      const object = e.target
      if (object) {
        object.set({
          cornerColor: "#FFF",
          cornerStyle: "circle",
          borderColor: "#8a4fec",
          borderScaleFactor: 1.5,
          transparentCorners: false,
          borderOpacityWhenMoving: 1,
          cornerStrokeColor: "#8a4fec",
        })

        // TODO: MAKE IT MORE LIKE CANVA SELECTOR

        // Define custom controls
        // object.controls = {
        //   ...object.controls,
        //   mtr: new fabric.Control({
        //     x: 0,
        //     y: -0.58,
        //     offsetY: -30,
        //     cursorStyle: "grab",
        //     actionName: "rotate",
        //     actionHandler: fabric.controlsUtils.rotationWithSnapping,
        //   }),
        // }

        fabricCanvas.renderAll()
      }
    })

    // Add listeners for object selection and deselection
    const updateSelectedProperties = () => {
      const activeObject = fabricCanvas.getActiveObject()

      if (activeObject && activeObject.type === "textbox") {
        setSelectedTextProperties({
          fontFamily: activeObject.get("fontFamily") as string,
          fontColor: activeObject.get("fill") as string,
          isTextSelected: true,
        })
      } else {
        setSelectedTextProperties({
          fontFamily: DEFAULT_FONT_FAMILY,
          fontColor: DEFAULT_FONT_COLOR,
          isTextSelected: false,
        })
      }

      // Update image selection state
      if (activeObject && activeObject.type === "image") {
        setIsImageSelected(true)
      } else {
        setIsImageSelected(false)
      }
    }

    // Listen to multiple events that might change selection
    fabricCanvas.on("selection:created", updateSelectedProperties)
    fabricCanvas.on("selection:updated", updateSelectedProperties)
    fabricCanvas.on("selection:cleared", updateSelectedProperties)

    // Add a listener for object modifications
    fabricCanvas.on("object:modified", updateSelectedProperties)

    adjustCanvasSize(fabricCanvas, isMobile) // Initial size adjustment

    // Update objects state when objects are added/removed/modified
    const updateObjectsState = () => {
      if (!fabricCanvas) return;
      
      const hasSelectedObject = fabricCanvas.getActiveObject() !== null
      setHasObjects(hasSelectedObject)
    }

    // Call updateObjectsState initially
    updateObjectsState()

    fabricCanvas.on("object:added", updateObjectsState)
    fabricCanvas.on("object:removed", updateObjectsState)
    fabricCanvas.on("selection:created", updateObjectsState)
    fabricCanvas.on("selection:cleared", updateObjectsState)
    fabricCanvas.on("selection:updated", updateObjectsState)
    fabricCanvas.on("mouse:up", updateObjectsState)

    return () => {
      // Remove event listeners
      fabricCanvas.off("object:added", updateObjectsState)
      fabricCanvas.off("object:removed", updateObjectsState)
      fabricCanvas.off("selection:created", updateObjectsState)
      fabricCanvas.off("selection:cleared", updateObjectsState)
      fabricCanvas.off("selection:updated", updateObjectsState)
      fabricCanvas.off("mouse:up", updateObjectsState)
      fabricCanvas.off("selection:created", updateSelectedProperties)
      fabricCanvas.off("selection:updated", updateSelectedProperties)
      fabricCanvas.off("selection:cleared", updateSelectedProperties)
      fabricCanvas.off("object:modified", updateSelectedProperties)
      fabricCanvas.off("object:added", () => setHasCanvasChanged(true))
      fabricCanvas.off("object:removed", () => setHasCanvasChanged(true))
      fabricCanvas.off("object:modified", () => setHasCanvasChanged(true))
      fabricCanvas.off('object:modified', hideLines)
      fabricCanvas.off('selection:cleared', hideLines)
      fabricCanvas.off('mouse:up', hideLines)
      centerLineX.current = null
      centerLineY.current = null
      fabricCanvas.dispose()
    }
  }, [])

  React.useEffect(() => {
    if (canvas) {
      adjustCanvasSize(canvas, isMobile) // Adjust size on window resize
      canvas.renderAll()
    }
  }, [isMobile, windowSize.width, windowSize.height])

  React.useEffect(() => {
    if (!canvas) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && canvas.getActiveObject()) {
        deleteSelectedObject()
      }
    }

    // Add event listener to the window
    window.addEventListener("keydown", handleKeyDown)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [canvas, deleteSelectedObject])

  React.useEffect(() => {
    if (!canvas) return
    
    // Update canvas background color when dark mode changes
    setCurrentBackgroundColor(isDarkMode ? DARK_MODE_CANVAS_BG : LIGHT_MODE_CANVAS_BG)
    canvas.backgroundColor = isDarkMode ? DARK_MODE_CANVAS_BG : LIGHT_MODE_CANVAS_BG
    canvas.renderAll()
  }, [isDarkMode, canvas])

  // Track background color changes
  React.useEffect(() => {
    if (currentBackgroundColor !== (isDarkMode ? DARK_MODE_CANVAS_BG : LIGHT_MODE_CANVAS_BG)) {
      setHasCanvasChanged(true)
    }
  }, [currentBackgroundColor, isDarkMode])

  // Update center lines color when dark mode changes
  React.useEffect(() => {
    if (centerLineX.current && centerLineY.current) {
      const color = isDarkMode ? '#ffffff' : '#000000'
      centerLineX.current.set({ stroke: color })
      centerLineY.current.set({ stroke: color })
      canvas?.renderAll()
    }
  }, [isDarkMode, canvas])

  function adjustCanvasSize(fabricCanvas: Canvas, isMobile: boolean) {
    if (isMobile) {
      // On mobile, fit width to screen and maintain 9:16 ratio
      const maxWidth = Math.min(windowSize.width! * CANVAS_DIMENSIONS.mobileMultiplier, CANVAS_DIMENSIONS.width);
      const height = (maxWidth * 16) / 9;
      
      fabricCanvas.setDimensions({ 
        width: maxWidth, 
        height: height 
      });
    } else {
      // On desktop, fit height to viewport and maintain 9:16 ratio
      const maxHeight = Math.min(windowSize.height! * 0.8, CANVAS_DIMENSIONS.height);
      const width = (maxHeight * 9) / 16;
      
      fabricCanvas.setDimensions({ 
        width: width, 
        height: maxHeight 
      });
    }
  }

  async function setBackgroundImage(imageUrl: string): Promise<Canvas | null> {
    if (!canvas) return null

    const img = await FabricImage.fromURL(imageUrl)

    if (!img) {
      alert("Failed to load image")
      return null
    }

    if (windowSize.width! > 768) {
      // Desktop: maintain aspect ratio but fit in viewport
      const maxHeight = windowSize.height! * 0.8; // 80% of viewport height
      const scale = maxHeight / CANVAS_DIMENSIONS.height;
      const scaledWidth = CANVAS_DIMENSIONS.width * scale;
      
      canvas.setDimensions({ 
        width: scaledWidth, 
        height: maxHeight 
      });
    } else {
      // Mobile: Scale width to screen size and maintain aspect ratio
      const maxWidth = windowSize.width! * CANVAS_DIMENSIONS.mobileMultiplier;
      const scale = maxWidth / CANVAS_DIMENSIONS.width;
      const scaledHeight = CANVAS_DIMENSIONS.height * scale;
      
      canvas.setDimensions({ 
        width: maxWidth, 
        height: scaledHeight 
      });
    }

    // Scale the background image to cover the entire canvas
    const canvasWidth = canvas.width!
    const canvasHeight = canvas.height!
    const scaleX = canvasWidth / img.width!
    const scaleY = canvasHeight / img.height!
    const scale = Math.max(scaleX, scaleY)

    img.scale(scale)
    img.set({
      originX: "center",
      originY: "center",
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      objectCaching: false,
    })

    canvas.backgroundImage = img
    canvas.renderAll()

    return canvas
  }

  function addText() {
    if (!canvas) return

    const text = new fabric.Textbox(DEFAULT_TEXT_OPTIONS.text, {
      ...DEFAULT_TEXT_OPTIONS,
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 3,
      width: canvas.getWidth() * 0.8,
      originX: "center",
      originY: "center",
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  function changeFontFamily(fontFamily: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "textbox") {
      try {
        activeObject.set({
          fontFamily: fontFamily,
        })

        // Force a re-render of the canvas
        canvas.requestRenderAll()

        // Update the selected text properties
        setSelectedTextProperties((prev) => ({
          ...prev,
          fontFamily: fontFamily,
        }))
      } catch (error) {
        console.error("Error changing font family:", error)
      }
    }
  }

  function changeTextColor(color: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as fabric.Textbox
      text.set("fill", color)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        fontColor: color,
      }))

      canvas.renderAll()
    }
  }

  async function addImage(imagePath: string) {
    if (!canvas) return

    const img = await FabricImage.fromURL(imagePath)

    if (!img) {
      console.error("Failed to load image")
      return
    }

    const { width, height } = canvas
    const scale = Math.min(
      (width! * 0.4) / img.width!,
      (height! * 0.3) / img.height!
    )

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: width! / 2,
      top: height! / 2,
      originX: "center",
      originY: "center",
      selectable: true,
    })

    canvas.add(img)
    canvas.setActiveObject(img)
    canvas.renderAll()
  }

  function flipImage(direction: "horizontal" | "vertical") {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject && activeObject.type === "image") {
      const image = activeObject as fabric.Image
      direction === "horizontal"
        ? image.set("flipX", !image.flipX)
        : image.set("flipY", !image.flipY)

      canvas.renderAll()
    }
  }

  function toggleFilter() {
    // Move to the next filter in the list
    const nextIndex = (currentFilterIndex + 1) % filterNames.length
    setCurrentFilterIndex(nextIndex)

    // Determine the next filter
    const nextFilter = filterNames[nextIndex]

    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "image") {
      const image = activeObject as FabricImage
      const filter = getFilter(nextFilter)

      image.filters = filter ? [filter] : []
      image.applyFilters()
      ;(image as any).filterName = nextFilter
      canvas.renderAll()
    }
  }

  function deleteSelectedObject() {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      canvas.remove(activeObject)
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  function downloadCanvas() {
    if (!canvas || !hasCanvasChanged) return

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 3,
    })

    const link = document.createElement("a")
    link.href = dataURL
    link.download = "meme.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function changeBackgroundColor(color: string) {
    if (canvas) {
      setCurrentBackgroundColor(color)
      canvas.backgroundColor = color
      canvas.renderAll()
    }
  }

  function toggleDarkMode() {
    setIsDarkMode(prev => !prev)
  }

  return {
    canvasRef,
    setBackgroundImage,
    addText,
    addImage,
    changeFontFamily,
    changeTextColor,
    flipImage,
    changeBackgroundColor,
    currentBackgroundColor,
    deleteSelectedObject,
    downloadCanvas,
    selectedTextProperties,
    toggleFilter,
    isImageSelected,
    isDarkMode,
    toggleDarkMode,
    hasCanvasChanged,
    hasObjects,
  }
}
