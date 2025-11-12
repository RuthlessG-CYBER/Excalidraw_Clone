import { useEffect, useRef, useState } from 'react'

export interface Point {
  x: number
  y: number
}

export interface Shape {
  id: string
  type: 'square' | 'circle' | 'diamond' | 'arrow' | 'line' | 'pencil' | 'text'
  start: Point
  end?: Point
  points?: Point[]
  text?: string
  color: string
  strokeWidth: number
}

interface CanvasProps {
  activeTool: string
  shapes: Shape[]
  onShapesChange: (shapes: Shape[]) => void
  zoom: number
  pan: Point
  onPanChange: (pan: Point) => void
}

export function Canvas({ activeTool, shapes, onShapesChange, zoom, pan, onPanChange }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentShape, setCurrentShape] = useState<Shape | null>(null)
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState<Point | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Draw all shapes
    shapes.forEach((shape) => {
      drawShape(ctx, shape, shape.id === selectedShapeId)
    })

    // Draw current shape being drawn
    if (currentShape) {
      drawShape(ctx, currentShape, false)
    }

    ctx.restore()
  }, [shapes, currentShape, zoom, pan, selectedShapeId])

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, isSelected: boolean) => {
    ctx.strokeStyle = isSelected ? '#4f46e5' : shape.color
    ctx.lineWidth = shape.strokeWidth
    ctx.fillStyle = 'transparent'

    if (shape.type === 'square' && shape.end) {
      const width = shape.end.x - shape.start.x
      const height = shape.end.y - shape.start.y
      ctx.strokeRect(shape.start.x, shape.start.y, width, height)
      if (isSelected) {
        ctx.fillStyle = 'rgba(79, 70, 229, 0.1)'
        ctx.fillRect(shape.start.x, shape.start.y, width, height)
      }
    } else if (shape.type === 'circle' && shape.end) {
      const radius = Math.sqrt(
        Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2)
      )
      ctx.beginPath()
      ctx.arc(shape.start.x, shape.start.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
      if (isSelected) {
        ctx.fillStyle = 'rgba(79, 70, 229, 0.1)'
        ctx.fill()
      }
    } else if (shape.type === 'diamond' && shape.end) {
      const centerX = (shape.start.x + shape.end.x) / 2
      const centerY = (shape.start.y + shape.end.y) / 2

      ctx.beginPath()
      ctx.moveTo(centerX, shape.start.y)
      ctx.lineTo(shape.end.x, centerY)
      ctx.lineTo(centerX, shape.end.y)
      ctx.lineTo(shape.start.x, centerY)
      ctx.closePath()
      ctx.stroke()
      if (isSelected) {
        ctx.fillStyle = 'rgba(79, 70, 229, 0.1)'
        ctx.fill()
      }
    } else if (shape.type === 'line' && shape.end) {
      ctx.beginPath()
      ctx.moveTo(shape.start.x, shape.start.y)
      ctx.lineTo(shape.end.x, shape.end.y)
      ctx.stroke()
    } else if (shape.type === 'arrow' && shape.end) {
      const headLength = 15
      const angle = Math.atan2(shape.end.y - shape.start.y, shape.end.x - shape.start.x)

      ctx.beginPath()
      ctx.moveTo(shape.start.x, shape.start.y)
      ctx.lineTo(shape.end.x, shape.end.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(shape.end.x, shape.end.y)
      ctx.lineTo(
        shape.end.x - headLength * Math.cos(angle - Math.PI / 6),
        shape.end.y - headLength * Math.sin(angle - Math.PI / 6)
      )
      ctx.moveTo(shape.end.x, shape.end.y)
      ctx.lineTo(
        shape.end.x - headLength * Math.cos(angle + Math.PI / 6),
        shape.end.y - headLength * Math.sin(angle + Math.PI / 6)
      )
      ctx.stroke()
    } else if (shape.type === 'pencil' && shape.points && shape.points.length > 1) {
      ctx.beginPath()
      ctx.moveTo(shape.points[0].x, shape.points[0].y)
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y)
      }
      ctx.stroke()
    } else if (shape.type === 'text' && shape.text) {
      ctx.font = '16px Arial'
      ctx.fillStyle = shape.color
      ctx.fillText(shape.text, shape.start.x, shape.start.y)
    }
  }

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e)

    if (activeTool === 'hand') {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      return
    }

    if (activeTool === 'select') {
      // Check if clicking on existing shape
      const clickedShape = shapes.find((shape) => isPointInShape(point, shape))
      if (clickedShape) {
        setSelectedShapeId(clickedShape.id)
        setDragOffset({
          x: point.x - clickedShape.start.x,
          y: point.y - clickedShape.start.y,
        })
        setIsDrawing(true)
      } else {
        setSelectedShapeId(null)
      }
      return
    }

    if (activeTool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        const newShape: Shape = {
          id: Date.now().toString(),
          type: 'text',
          start: point,
          text,
          color: '#000000',
          strokeWidth: 2,
        }
        onShapesChange([...shapes, newShape])
      }
      return
    }

    setIsDrawing(true)
    const newShape: Shape = {
      id: Date.now().toString(),
      type: activeTool as Shape['type'],
      start: point,
      end: point,
      points: activeTool === 'pencil' ? [point] : undefined,
      color: '#000000',
      strokeWidth: 2,
    }
    setCurrentShape(newShape)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && activeTool === 'hand') {
      onPanChange({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
      return
    }

    if (!isDrawing || !currentShape) return

    const point = getCanvasPoint(e)

    if (activeTool === 'select' && selectedShapeId && dragOffset) {
      // Drag selected shape
      const shape = shapes.find((s) => s.id === selectedShapeId)
      if (shape) {
        const updatedShapes = shapes.map((s) => {
          if (s.id === selectedShapeId) {
            const deltaX = point.x - dragOffset.x - s.start.x
            const deltaY = point.y - dragOffset.y - s.start.y
            return {
              ...s,
              start: { x: point.x - dragOffset.x, y: point.y - dragOffset.y },
              end: s.end ? { x: s.end.x + deltaX, y: s.end.y + deltaY } : undefined,
              points: s.points?.map((p) => ({ x: p.x + deltaX, y: p.y + deltaY })),
            }
          }
          return s
        })
        onShapesChange(updatedShapes)
      }
      return
    }

    if (activeTool === 'pencil') {
      setCurrentShape({
        ...currentShape,
        points: [...(currentShape.points || []), point],
      })
    } else {
      setCurrentShape({
        ...currentShape,
        end: point,
      })
    }
  }

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false)
      return
    }

    if (isDrawing && currentShape && activeTool !== 'select') {
      onShapesChange([...shapes, currentShape])
      setCurrentShape(null)
    }
    setIsDrawing(false)
    setDragOffset(null)
  }

  const isPointInShape = (point: Point, shape: Shape): boolean => {
    const tolerance = 10

    if (shape.type === 'square' && shape.end) {
      const minX = Math.min(shape.start.x, shape.end.x)
      const maxX = Math.max(shape.start.x, shape.end.x)
      const minY = Math.min(shape.start.y, shape.end.y)
      const maxY = Math.max(shape.start.y, shape.end.y)
      return point.x >= minX - tolerance && point.x <= maxX + tolerance &&
        point.y >= minY - tolerance && point.y <= maxY + tolerance
    }

    if (shape.type === 'circle' && shape.end) {
      const radius = Math.sqrt(
        Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2)
      )
      const dist = Math.sqrt(
        Math.pow(point.x - shape.start.x, 2) + Math.pow(point.y - shape.start.y, 2)
      )
      return Math.abs(dist - radius) < tolerance
    }

    return false
  }

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="absolute inset-0"
      style={{ cursor: activeTool === 'hand' ? 'grab' : activeTool === 'select' ? 'default' : 'crosshair' }}
    />
  )
}