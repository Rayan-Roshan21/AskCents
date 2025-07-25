import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, TrendingUp, PiggyBank, CreditCard, BookOpen, Link, Shield, Check, Loader } from 'lucide-react'
import { usePlaidLink } from 'react-plaid-link'
import { createLinkToken, exchangePublicToken, getAccounts } from '../services/plaidService'

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [linkBank, setLinkBank] = useState(false)
  const [isLinkingBank, setIsLinkingBank] = useState(false)
  const [plaidResult, setPlaidResult] = useState(null)
  const [linkToken, setLinkToken] = useState(null)

  // Get link token when component mounts
  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const result = await createLinkToken()
        if (result.success) {
          setLinkToken(result.link_token)
        } else {
          console.error('Failed to create link token:', result.error)
        }
      } catch (error) {
        console.error('Error creating link token:', error)
      }
    }
    getLinkToken()
  }, [])

  // Auto-proceed to next step when bank linking is complete
  useEffect(() => {
    if (plaidResult?.success && steps[currentStep] === 'bank' && linkBank) {
      // Small delay to show success state
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      }, 1500)
    }
  }, [plaidResult, currentStep, linkBank])

  // Plaid Link configuration
  const config = {
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      console.log('Plaid Link Success:', { publicToken, metadata })
      setIsLinkingBank(true)
      
      try {
        // Exchange public token for access token
        const exchangeResult = await exchangePublicToken(publicToken)
        if (exchangeResult.success) {
          // Get account information
          const accountsResult = await getAccounts()
          if (accountsResult.success) {
            setPlaidResult({
              success: true,
              accounts: accountsResult.accounts,
              item: accountsResult.item,
              institution: metadata.institution,
              publicToken,
              accessToken: exchangeResult.access_token
            })
            console.log('Bank successfully linked!')
          } else {
            console.error('Failed to get accounts:', accountsResult.error)
          }
        } else {
          console.error('Failed to exchange token:', exchangeResult.error)
        }
      } catch (error) {
        console.error('Error during bank linking:', error)
      } finally {
        setIsLinkingBank(false)
      }
    },
    onExit: (err, metadata) => {
      console.log('Plaid Link Exit:', { err, metadata })
      setIsLinkingBank(false)
    },
    onEvent: (eventName, metadata) => {
      console.log('Plaid Link Event:', { eventName, metadata })
    }
  }

  const { open, ready } = usePlaidLink(config)

  const steps = [
    'welcome',
    'goals',
    'bank',
    'privacy'
  ]

  const goals = [
    { id: 'invest', label: 'Start investing', icon: TrendingUp, color: 'mint' },
    { id: 'save', label: 'Save smarter', icon: PiggyBank, color: 'navy' },
    { id: 'learn', label: 'Understand money', icon: BookOpen, color: 'navy' }
  ]

  const nextStep = async () => {
    // Handle bank linking before proceeding from bank step
    if (steps[currentStep] === 'bank' && linkBank) {
      if (ready) {
        open() // Open Plaid Link
        return // Don't proceed to next step until Plaid Link completes
      } else {
        console.error('Plaid Link not ready yet')
        return
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      onComplete({
        name: 'Rayan', // Could be extracted from email or separate input
        email: '', // No longer collected in onboarding
        goal: selectedGoal,
        bankLinked: linkBank && plaidResult?.success,
        plaidData: plaidResult // Include Plaid connection data
      })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (steps[currentStep]) {
      case 'goals':
        return selectedGoal !== ''
      default:
        return true
    }
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  const WelcomeScreen = () => (
    <motion.div 
      className="onboarding-screen welcome-screen"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="welcome-content">
        <motion.div 
          className="logo-container"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="app-logo">
            <span className="logo-text">AskCents</span>
            <div className="logo-icons">
              <span className="emoji">🎓</span>
              <span className="emoji">💸</span>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="welcome-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Welcome to AskCents!
        </motion.h1>
        
        <motion.p 
          className="welcome-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Make cents of your money.
        </motion.p>
        
        <motion.p 
          className="welcome-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Your AI-powered financial coach for students. Get personalized advice, track your money, and build healthy financial habits.
        </motion.p>
      </div>
    </motion.div>
  )

  const GoalsScreen = () => (
    <motion.div className="onboarding-screen goals-screen">
      <div className="screen-header">
        <h2>What's your goal?</h2>
        <p>Choose what you'd like to focus on first</p>
      </div>
      
      <div className="goals-grid">
        {goals.map((goal) => (
          <motion.button
            key={goal.id}
            className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''} ${goal.color}`}
            onClick={() => setSelectedGoal(goal.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: goal.id === 'invest' ? 0.1 : goal.id === 'save' ? 0.2 : goal.id === 'credit' ? 0.3 : 0.4 }}
          >
            <goal.icon className="goal-icon" />
            <span className="goal-label">{goal.label}</span>
            {selectedGoal === goal.id && (
              <motion.div
                className="selection-indicator"
                layoutId="selection"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Check size={16} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )

  const BankScreen = () => (
    <motion.div className="onboarding-screen bank-screen">
      <div className="screen-header">
        <h2>Link your bank account</h2>
        <p>Get personalized insights based on your spending (optional)</p>
      </div>
      
      <div className="bank-options">
        <motion.button
          className={`bank-option ${linkBank ? 'selected' : ''}`}
          onClick={() => setLinkBank(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLinkingBank}
        >
          <div className="bank-icon-container">
            {isLinkingBank ? (
              <Loader className="bank-icon loading" />
            ) : (
              <Link className="bank-icon" />
            )}
          </div>
          <div className="bank-content">
            <h3>{isLinkingBank ? 'Connecting...' : 'Yes, link my bank'}</h3>
            <p>Powered by Plaid • Bank-level security</p>
            <span className="bank-benefit">
              {isLinkingBank ? 'Connecting to Plaid API...' : 'Get personalized spending insights'}
            </span>
          </div>
          {linkBank && !isLinkingBank && (
            <motion.div
              className="selection-indicator"
              layoutId="bankSelection"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Check size={16} />
            </motion.div>
          )}
        </motion.button>

        {plaidResult && plaidResult.success && (
          <motion.div
            className="connection-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">✅</div>
            <div className="success-content">
              <h4>Successfully Connected!</h4>
              <p>Connected via Plaid API</p>
              <span className="account-count">
                {plaidResult.accounts?.length || 0} accounts found
              </span>
            </div>
          </motion.div>
        )}
        
        <motion.button
          className={`bank-option ${!linkBank ? 'selected' : ''}`}
          onClick={() => setLinkBank(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLinkingBank}
        >
          <div className="bank-icon-container secondary">
            <BookOpen className="bank-icon" />
          </div>
          <div className="bank-content">
            <h3>Maybe later</h3>
            <p>You can always link your bank later</p>
            <span className="bank-benefit">Start with general advice</span>
          </div>
          {!linkBank && (
            <motion.div
              className="selection-indicator"
              layoutId="bankSelection"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Check size={16} />
            </motion.div>
          )}
        </motion.button>
      </div>
    </motion.div>
  )

  const PrivacyScreen = () => (
    <motion.div className="onboarding-screen privacy-screen">
      <div className="privacy-content">
        <motion.div 
          className="privacy-icon"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Shield className="shield-icon" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your privacy matters
        </motion.h2>
        
        <motion.div 
          className="privacy-promises"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="promise-item">
            <Check className="promise-check" />
            <span>Your info stays private</span>
          </div>
          <div className="promise-item">
            <Check className="promise-check" />
            <span>No judgment, just help</span>
          </div>
          <div className="promise-item">
            <Check className="promise-check" />
            <span>Bank-level security</span>
          </div>
          <div className="promise-item">
            <Check className="promise-check" />
            <span>You control your data</span>
          </div>
        </motion.div>
        
        <motion.p 
          className="privacy-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          We're here to help you succeed financially, not to judge your spending habits. Your data is encrypted and never sold to third parties.
        </motion.p>
      </div>
    </motion.div>
  )

  const renderCurrentScreen = () => {
    switch (steps[currentStep]) {
      case 'welcome':
        return <WelcomeScreen />
      case 'goals':
        return <GoalsScreen />
      case 'bank':
        return <BankScreen />
      case 'privacy':
        return <PrivacyScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="progress-text">
          {currentStep + 1} of {steps.length}
        </span>
      </div>

      <div className="onboarding-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {renderCurrentScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="onboarding-navigation">
        {currentStep > 0 && (
          <motion.button
            className="nav-btn secondary"
            onClick={prevStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
            Back
          </motion.button>
        )}
        
        <motion.button
          className={`nav-btn primary ${!canProceed() || isLinkingBank ? 'disabled' : ''}`}
          onClick={nextStep}
          disabled={!canProceed() || isLinkingBank}
          whileHover={canProceed() && !isLinkingBank ? { scale: 1.05 } : {}}
          whileTap={canProceed() && !isLinkingBank ? { scale: 0.95 } : {}}
        >
          {isLinkingBank ? (
            <>
              <Loader size={16} className="loading" />
              Connecting...
            </>
          ) : (
            <>
              {currentStep === steps.length - 1 ? 'Get started' : 'Continue'}
              <ChevronRight size={20} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default OnboardingFlow
