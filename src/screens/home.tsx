import { useState } from 'react'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
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
  FolderOpen,
  Save,
  ImageDown,
  Users,
  Command,
  Search,
  HelpCircle,
  Trash2,
  Github,
  ExternalLink,
  Sun,
  Moon,
  Palette,
  LogIn,
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

      {/* Top Toolbar */}
      <div className="absolute top-1 left-0 right-0 flex items-center justify-between z-10">
        {/* Left Menu */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Menu"
                className="bg-gray-100 hover:bg-gray-200"
              >
                <AlignJustify />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-xl shadow-lg border border-gray-200 bg-white"
              align="start"
              sideOffset={8}
            >
              <DropdownMenuItem className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save to...
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <ImageDown className="w-4 h-4" /> Export image...
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Live collaboration...
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2 text-indigo-600 font-medium">
                <Command className="w-4 h-4" /> Command palette
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Find on canvas
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Help
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-500"
                onClick={handleResetCanvas}
              >
                <Trash2 className="w-4 h-4" /> Reset the canvas
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Excalidraw+
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Follow us
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Discord chat
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2 text-indigo-600 font-semibold">
                <LogIn className="w-4 h-4" /> Sign up
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-gray-500 px-2">
                Theme
              </DropdownMenuLabel>
              <div className="flex items-center justify-between px-3 pb-2">
                <Button size="icon" variant="ghost" className="rounded-md bg-indigo-100 text-indigo-700">
                  <Sun className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-md hover:bg-gray-100">
                  <Moon className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-md hover:bg-gray-100">
                  <Palette className="w-4 h-4" />
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center Toolbar */}
        <div className="flex items-center gap-1 bg-white border shadow-sm rounded-md px-2 py-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              onClick={() => setActive(tool.id)}
              className={`${active === tool.id
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tool.icon}
            </Button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-black bg-gray-100 hover:bg-blue-400 hover:text-white transition-colors duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Excalidraw+
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-black bg-gray-100 hover:bg-blue-400 hover:text-white transition-colors duration-300"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-amber-50">
              <DialogHeader>
                <DialogTitle>Share this project</DialogTitle>
                <DialogDescription>
                  Copy the link below or invite collaborators.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  readOnly
                  value="https://yourapp.com/project/123"
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                />
                <Button
                  variant="default"
                  onClick={() => navigator.clipboard.writeText("https://yourapp.com/project/123")}
                >
                  Copy
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-black bg-gray-100 hover:bg-blue-400 hover:text-white transition-colors duration-300"
          >
            <AppWindow className="w-4 h-4" />
          </Button>
          {onLogout && (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-black bg-gray-100 hover:bg-red-500 hover:text-white transition-colors duration-300"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        )}
        </div>

        
      </div>

      {/* Bottom Left Controls */}
      <div className="fixed bottom-5 left-5 flex items-center gap-3 z-10">
        <div className="flex items-center gap-2 bg-gray-50 border rounded-full px-3 py-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border rounded-full px-3 py-1 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleUndo}
            disabled={historyStep <= 0}
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Right Controls */}
      <div className="fixed bottom-5 right-5 flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-gray-50 border rounded-full shadow-sm text-indigo-600"
        >
          <ShieldCheck className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-gray-50 border rounded-full shadow-sm"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default Home