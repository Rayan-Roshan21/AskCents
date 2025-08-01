import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Shield, CreditCard, TrendingUp, Lock, Loader } from 'lucide-react'
import { usePlaidLink } from 'react-plaid-link'
import { createLinkToken, exchangePublicToken, getUserFinancialData, extractUserProfile } from '../services/plaidService'
import { useUser } from '../contexts/UserContext'
import logoImage from '../assets/logo_white.png'

const LoginScreen = ({ onLoginComplete }) => {
  const [linkToken, setLinkToken] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const { updateUser, updatePlaidData } = useUser()

  // Get link token when component mounts
  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const result = await createLinkToken()
        if (result.success) {
          setLinkToken(result.link_token)
        } else {
          setConnectionError('Failed to initialize Plaid connection')
        }
      } catch (error) {
        setConnectionError('Failed to initialize Plaid connection')
      }
    }
    getLinkToken()
  }, [])

  // Plaid Link configuration
  const config = {
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      console.log('Plaid Link Success:', { publicToken, metadata })
      setIsConnecting(true)
      setConnectionError(null)
      
      try {
        // Exchange public token for access token
        const exchangeResult = await exchangePublicToken(publicToken)
        if (exchangeResult.success) {
          console.log('Token exchange successful')
          
          // Get comprehensive user financial data
          const financialDataResult = await getUserFinancialData()
          if (financialDataResult.success) {
            const { data: financialData } = financialDataResult
            
            // Extract user profile from identity data
            const userProfile = extractUserProfile(financialData.identity)
            
            // Create user object from Plaid data
            const userData = {
              name: userProfile?.name || 'User',
              email: userProfile?.email || '',
              phone: userProfile?.phone || '',
              address: userProfile?.address || null,
              hasPlaidConnection: true,
              connectedAt: new Date().toISOString(),
              onboardingCompleted: false, // Will trigger onboarding
              loginMethod: 'plaid',
              institution: metadata.institution
            }

            // Update contexts
            updateUser(userData)
            updatePlaidData(financialData)

            console.log('User authenticated via Plaid:', userData)
            onLoginComplete(userData)
          } else {
            throw new Error('Failed to fetch financial data')
          }
        } else {
          throw new Error('Token exchange failed')
        }
      } catch (error) {
        console.error('Bank connection failed:', error.message)
        setConnectionError(`Connection failed: ${error.message}`)
      } finally {
        setIsConnecting(false)
      }
    },
    onExit: (err, metadata) => {
      console.log('Plaid Link Exit:', { err, metadata })
      setIsConnecting(false)
      if (err) {
        setConnectionError('Bank connection was cancelled or failed')
      }
    },
    onEvent: (eventName, metadata) => {
      console.log('Plaid Link Event:', { eventName, metadata })
    }
  }

  const { open, ready } = usePlaidLink(config)

  const handlePlaidLogin = () => {
    if (ready) {
      setConnectionError(null)
      open()
    }
  }

  const handleDemoLogin = () => {
    const demoUser = {
      name: 'Demo User',
      email: 'demo@askcents.com',
      hasPlaidConnection: false,
      onboardingCompleted: false,
      loginMethod: 'demo',
      createdAt: new Date().toISOString()
    }
    onLoginComplete(demoUser)
  }

  return (
    <div className="login-screen">
      {/* Left Side - Hero Section */}
      <motion.div 
        className="login-hero"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div 
            className="app-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img src={logoImage} alt="AskCents" className="logo-image" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Smart Financial Decisions Start Here
          </motion.h1>
          
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Your AI-powered financial coach designed for students. 
            Get personalized insights, track spending, and build healthy financial habits.
          </motion.p>

          <motion.div 
            className="hero-decoration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Authentication */}
      <motion.div 
        className="login-auth"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="auth-container">
          <motion.div 
            className="auth-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2>Get Started</h2>
            <p>Connect your bank account for personalized financial insights</p>
          </motion.div>

          {/* Security Features */}
          <motion.div 
            className="security-badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
          </motion.div>

          {/* Plaid Connect Button */}
          <motion.button
            className="connect-button"
            onClick={handlePlaidLogin}
            disabled={!ready || isConnecting}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={ready && !isConnecting ? { scale: 1.02 } : {}}
            whileTap={ready && !isConnecting ? { scale: 0.98 } : {}}
          >
            {isConnecting ? (
              <>
                <Loader className="loading-icon" />
                <span>Connecting...</span>
              </>
            ) : !ready ? (
              <>
                <Loader className="loading-icon" />
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <CreditCard size={24} />
                <span>Connect Your Bank</span>
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>

          {/* Connection Error */}
          {connectionError && (
            <motion.div 
              className="error-alert"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {connectionError}
            </motion.div>
          )}

          {/* Demo Option */}
          <motion.div 
            className="demo-option"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="divider">
              <span>or explore with demo data</span>
            </div>
            <button
              type="button"
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={isConnecting}
            >
              Try Demo Mode
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

export default LoginScreen
