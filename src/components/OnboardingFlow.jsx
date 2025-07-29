import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, TrendingUp, PiggyBank, CreditCard, BookOpen, Shield, Check, Sparkles, Target, BarChart3 } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

// Animation variants for step transitions
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState('')

  const { updateUser, user } = useUser()

  // Welcome flow for introducing the app features after Plaid login
  const steps = ['welcome', 'goals', 'features', 'ready']

  const goals = [
    { id: 'invest', label: 'Start Investing', icon: TrendingUp, color: 'navy' },
    { id: 'save', label: 'Build Savings', icon: PiggyBank, color: 'mint' },
    { id: 'credit', label: 'Build Credit', icon: CreditCard, color: 'beige' },
    { id: 'budget', label: 'Budget Better', icon: BookOpen, color: 'gray' }
  ]

  const canProceed = () => {
    switch (steps[currentStep]) {
      case 'goals':
        return selectedGoal !== ''
      default:
        return true
    }
  }

  const nextStep = async () => {
    if (!canProceed()) return

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding/introduction
      const userData = {
        selectedGoal,
        onboardingCompleted: true,
        completedAt: new Date().toISOString()
      }
      
      updateUser(userData)
      onComplete(userData)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Screen Components
  const WelcomeScreen = () => (
    <div className="step-screen welcome-screen">
      <motion.div
        className="step-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="step-icon">
          <span className="emoji">🎉</span>
        </div>
        <h2>Welcome to AskCents, {user?.name || 'Student'}!</h2>
        <p>Great! Your bank account is connected and secure. Now let's personalize your financial coaching experience.</p>
      </motion.div>
      
      <motion.div
        className="step-features"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="feature-grid">
          <div className="feature-item">
            <BarChart3 className="feature-icon" />
            <h4>Real-Time Insights</h4>
            <p>Get instant analysis of your spending patterns and financial health</p>
          </div>
          <div className="feature-item">
            <Sparkles className="feature-icon" />
            <h4>AI-Powered Coaching</h4>
            <p>Receive personalized financial advice tailored to your student lifestyle</p>
          </div>
          <div className="feature-item">
            <Target className="feature-icon" />
            <h4>Smart Goal Setting</h4>
            <p>Set and achieve financial goals with intelligent tracking and guidance</p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const GoalsScreen = () => (
    <div className="step-screen goals-screen">
      <motion.div
        className="step-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="step-icon">
          <span className="emoji">🎯</span>
        </div>
        <h2>What's your main financial goal?</h2>
        <p>Choose your primary focus so we can personalize your experience and provide the most relevant advice.</p>
      </motion.div>

      <motion.div
        className="goals-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''}`}
            onClick={() => setSelectedGoal(goal.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <goal.icon className={`goal-icon ${goal.color}`} />
            <h4>{goal.label}</h4>
            {selectedGoal === goal.id && (
              <motion.div
                className="selected-indicator"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Check size={16} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )

  const FeaturesScreen = () => (
    <div className="step-screen features-screen">
      <motion.div
        className="step-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="step-icon">
          <span className="emoji">✨</span>
        </div>
        <h2>Discover AskCents Features</h2>
        <p>Here's what you can do with your personalized financial dashboard.</p>
      </motion.div>

      <motion.div
        className="features-showcase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="feature-showcase-grid">
          <motion.div 
            className="showcase-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="showcase-icon">
              <BarChart3 size={32} />
            </div>
            <h4>Smart Analytics</h4>
            <p>View your spending categories, track trends, and identify opportunities to save money</p>
          </motion.div>

          <motion.div 
            className="showcase-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="showcase-icon">
              <Target size={32} />
            </div>
            <h4>Goal Tracking</h4>
            <p>Set savings goals, track progress, and get personalized tips to reach your targets faster</p>
          </motion.div>

          <motion.div 
            className="showcase-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="showcase-icon">
              <Sparkles size={32} />
            </div>
            <h4>AI Insights</h4>
            <p>Get personalized recommendations and financial advice powered by artificial intelligence</p>
          </motion.div>

          <motion.div 
            className="showcase-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="showcase-icon">
              <Shield size={32} />
            </div>
            <h4>Secure & Private</h4>
            <p>Your financial data is protected with bank-level encryption and privacy controls</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )

  const ReadyScreen = () => (
    <div className="step-screen ready-screen">
      <motion.div
        className="step-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="step-icon">
          <span className="emoji">�</span>
        </div>
        <h2>You're all set!</h2>
        <p>Your financial dashboard is ready. Start exploring your personalized insights and take control of your financial future.</p>
      </motion.div>

      <motion.div
        className="ready-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="summary-grid">
          <div className="summary-item">
            <Check className="summary-icon" />
            <span>Bank account connected</span>
          </div>
          <div className="summary-item">
            <Check className="summary-icon" />
            <span>Goal selected: {selectedGoal ? goals.find(g => g.id === selectedGoal)?.label : 'None'}</span>
          </div>
          <div className="summary-item">
            <Check className="summary-icon" />
            <span>AI coaching activated</span>
          </div>
          <div className="summary-item">
            <Check className="summary-icon" />
            <span>Dashboard personalized</span>
          </div>
        </div>

        <div className="ready-cta">
          <h4>Ready to start your financial journey?</h4>
          <p>Click "Launch Dashboard" to begin exploring your personalized financial insights.</p>
        </div>
      </motion.div>
    </div>
  )

  const renderCurrentScreen = () => {
    switch (steps[currentStep]) {
      case 'welcome':
        return <WelcomeScreen />
      case 'goals':
        return <GoalsScreen />
      case 'features':
        return <FeaturesScreen />
      case 'ready':
        return <ReadyScreen />
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
          className={`nav-btn primary ${!canProceed() ? 'disabled' : ''}`}
          onClick={nextStep}
          disabled={!canProceed()}
          whileHover={canProceed() ? { scale: 1.05 } : {}}
          whileTap={canProceed() ? { scale: 0.95 } : {}}
        >
          {currentStep === steps.length - 1 ? 'Launch Dashboard' : 'Continue'}
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  )
}

export default OnboardingFlow