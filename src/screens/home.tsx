import { useState } from 'react'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu'

import {
  AlignJustify,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  Image,
  MousePointer,
  Lock,
  Hand,
  Save,
  ImageDown,
  HelpCircle,
  Trash2,
  Sparkles,
  Share2,
  AppWindow,
  ShieldCheck,
  Undo2,
  Redo2,
  Plus,
  LogOut,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"

import { Canvas } from '../components/Canvas'
import type { Shape } from '../components/Canvas'


interface HomeProps {
  onLogout?: () => void
}

const Home = ({ onLogout }: HomeProps) => {
  const tools = [
    { id: "lock", icon: <Lock /> },
    { id: "hand", icon: <Hand /> },
    { id: "select", icon: <MousePointer /> },
    { id: "square", icon: <Square /> },
    { id: "diamond", icon: <Diamond /> },
    { id: "circle", icon: <Circle /> },
    { id: "arrow", icon: <ArrowRight /> },
    { id: "line", icon: <Minus /> },
    { id: "pencil", icon: <Pencil /> },
    { id: "text", icon: <Type /> },
    { id: "image", icon: <Image /> },
  ]

  const [active, setActive] = useState("select")
  const [shapes, setShapes] = useState<Shape[]>([])
  const [history, setHistory] = useState<Shape[][]>([])
  const [historyStep, setHistoryStep] = useState(-1)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const handleShapesChange = (newShapes: Shape[]) => {
    setShapes(newShapes)
    const newHistory = history.slice(0, historyStep + 1)
    setHistory([...newHistory, newShapes])
    setHistoryStep(historyStep + 1)
  }

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1)
      setShapes(history[historyStep - 1])
    }
  }

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1)
      setShapes(history[historyStep + 1])
    }
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.1))
  }

  const handleResetCanvas = () => {
    if (confirm('Are you sure you want to reset the canvas? This will delete all your work.')) {
      setShapes([])
      setHistory([])
      setHistoryStep(-1)
      setZoom(1)
      setPan({ x: 0, y: 0 })
    }
  }


  const handleSaveProject = async () => {
    const projectData = {
      userId: "USER_ID_HERE",
      shapes,
      zoom,
      pan
    };

    try {
      const res = await fetch("http://localhost:5000/api/project/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });

      const data = await res.json();
      if (data.success) alert("Saved to backend!");
      else alert("Failed to save!");
    } catch (err) {
      console.log(err);
      alert("Error saving!");
    }
  };


  const handleExportLocal = () => {
    const exportData = {
      shapes,
      zoom,
      pan,
      exportedAt: new Date()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "excalidraw_project.json";
    link.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-gray-50 overflow-hidden">

      <Canvas 
        activeTool={active} 
        shapes={shapes} 
        onShapesChange={handleShapesChange}
        zoom={zoom}
        pan={pan}
        onPanChange={setPan}
      />


      {/* Top Menu */}
      <div className="absolute top-1 left-0 right-0 flex items-center justify-between z-10">

        {/* Left Menu */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-gray-100 hover:bg-gray-200">
                <AlignJustify />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 rounded-xl shadow-lg border bg-white">

              <DropdownMenuItem className="flex items-center gap-2" onClick={handleSaveProject}>
                <Save className="w-4 h-4" />
                Save to Backend
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2" onClick={handleExportLocal}>
                <ImageDown className="w-4 h-4" />
                Export to Local
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2 text-red-500" onClick={handleResetCanvas}>
                <Trash2 className="w-4 h-4" /> Reset canvas
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        {/* Center */}
        <div className="flex items-center gap-1 bg-white border shadow-sm rounded-md px-2 py-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              onClick={() => setActive(tool.id)}
              className={active === tool.id ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}
            >
              {tool.icon}
            </Button>
          ))}
        </div>


        {/* Right */}
        <div className="flex items-center gap-3">
          <Button className="flex items-center gap-2 bg-gray-100 hover:bg-blue-400 text-black hover:text-white">
            <Sparkles className="w-4 h-4" />
            Excalidraw+
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gray-100 hover:bg-blue-400 text-black hover:text-white">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-amber-50">
              <DialogHeader>
                <DialogTitle>Share this project</DialogTitle>
                <DialogDescription>Copy the link below.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 mt-2">
                <input type="text" readOnly value="https://yourapp.com/project/123" className="flex-1 border rounded-md px-3 py-2 text-sm" />
                <Button onClick={() => navigator.clipboard.writeText("https://yourapp.com/project/123")}>
                  Copy
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="bg-gray-100">
            <AppWindow className="w-4 h-4" />
          </Button>

          {onLogout && (
            <Button variant="outline" className="bg-gray-100 hover:bg-red-500 hover:text-white" onClick={onLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          )}
        </div>

      </div>


      {/* Left */}
      <div className="fixed bottom-5 left-5 flex items-center gap-3 z-10">
        <div className="flex items-center gap-2 bg-gray-50 border rounded-full px-3 py-1 shadow-sm">
          <Button size="icon" variant="ghost" onClick={handleZoomOut}><Minus /></Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button size="icon" variant="ghost" onClick={handleZoomIn}><Plus /></Button>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border rounded-full px-3 py-1 shadow-sm">
          <Button size="icon" variant="ghost" onClick={handleUndo} disabled={historyStep <= 0}><Undo2 /></Button>
          <Button size="icon" variant="ghost" onClick={handleRedo} disabled={historyStep >= history.length - 1}><Redo2 /></Button>
        </div>
      </div>


      {/* Bottom Right */}
      <div className="fixed bottom-5 right-5 flex items-center gap-2 z-10">
        <Button size="icon" variant="ghost" className="bg-gray-50 border rounded-full"><ShieldCheck /></Button>
        <Button size="icon" variant="ghost" className="bg-gray-50 border rounded-full"><HelpCircle /></Button>
      </div>

    </div>
  )
}

export default Home
