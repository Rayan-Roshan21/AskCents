import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoginScreen from './components/LoginScreen'
import OnboardingFlow from './components/OnboardingFlow'
import MainApp from './components/MainApp'
import { UserProvider, useUser } from './contexts/UserContext'
import './App.css'
import './styles/components.css'

function AppContent() {
  const { user, isLoading } = useUser()
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
    <MainApp user={user} />
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