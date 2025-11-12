import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, UserPlus } from "lucide-react"

const API_URL = "https://excalidraw-backend-wrk7.onrender.com"

export default function SignupPage({
  onSignupSuccess,
  onSwitchToLogin,
}: {
  onSignupSuccess?: (user: any) => void
  onSwitchToLogin?: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSignup = async () => {
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Signup failed")

      setSuccess("Account created successfully! You can now log in.")
      if (onSignupSuccess) onSignupSuccess(data.user)
    } catch (err: any) {
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Card className="w-full max-w-sm shadow-lg rounded-2xl border border-green-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-green-700">Create an Account</CardTitle>
          <CardDescription className="text-gray-500">Sign up to get started</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing up..." : (<><UserPlus className="w-4 h-4" />Sign Up</>)}
          </Button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="text-green-600 hover:underline">
              Log in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
