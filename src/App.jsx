import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Import components
import OnboardingFlow from './components/OnboardingFlow'
import MainApp from './components/MainApp'

function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding')
  const [user, setUser] = useState(null)

  const handleOnboardingComplete = (userData) => {
    setUser(userData)
    setCurrentScreen('main')
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentScreen === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          </motion.div>
        )}
        
        {currentScreen === 'main' && user && (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <MainApp user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
