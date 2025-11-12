import { useEffect, useState } from "react"
import Home from "./screens/home"
import LoginPage from "./screens/login"
import SignupPage from "./screens/signup"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSignup, setIsSignup] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) setIsLoggedIn(true)
  }, [])

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
  }
  
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="relative flex-1 flex items-center justify-center p-5">
        {isLoggedIn ? (
          <Home onLogout={handleLogout} />
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
