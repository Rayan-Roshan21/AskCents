import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoginScreen from './components/LoginScreen'
import OnboardingFlow from './components/OnboardingFlow'
import MainApp from './components/MainApp'
import { UserProvider, useUser } from './contexts/UserContext'
import './App.css'
import './styles/components.css'

function AppContent() {
  const { user, isLoading, clearUserData } = useUser()
  const [showOnboarding, setShowOnboarding] = useState(false)

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading AskCents...</p>
      </div>
    )
  }

  // Temporary logout button for testing - you can remove this later
  const handleLogout = () => {
    clearUserData()
    setShowOnboarding(false)
  }

  const handleLoginComplete = (userData) => {
    if (!userData.onboardingCompleted) {
      setShowOnboarding(true)
    }
  }

  const handleOnboardingComplete = (userData) => {
    setShowOnboarding(false)
  }

  if (!user) {
    return <LoginScreen onLoginComplete={handleLoginComplete} />
  }

  if (showOnboarding || !user.onboardingCompleted) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div>
      {/* Temporary logout button - remove this after testing */}
      <button 
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 16px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Logout (Test)
      </button>
      <MainApp user={user} />
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App