import { useEffect, useState } from "react"
import Home from "./screens/home"
import LoginPage from "./screens/login"
import SignupPage from "./screens/signup"

type AppUser = {
  id: string
  name: string
  email: string
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token) {
      setIsLoggedIn(true)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          localStorage.removeItem("user")
        }
      }
    }
  }, [])

  const handleLogin = (userData: AppUser) => {
    setUser(userData)
    setIsLoggedIn(true)
  }
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
  }
  
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="relative flex-1 flex items-center justify-center p-5">
        {isLoggedIn ? (
          <Home onLogout={handleLogout} user={user ?? undefined} />
        ) : isSignup ? (
          <SignupPage
            onSignupSuccess={() => setIsSignup(false)}
            onSwitchToLogin={() => setIsSignup(false)}
          />
        ) : (
          <LoginPage
            onLogin={handleLogin}
            onSignupClick={() => setIsSignup(true)}
          />
        )}
      </div>
    </div>
  )
}

export default App
