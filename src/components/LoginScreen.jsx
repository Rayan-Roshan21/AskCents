import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Shield, CreditCard, TrendingUp, Lock, Loader } from 'lucide-react'
import { usePlaidLink } from 'react-plaid-link'
import { createLinkToken, exchangePublicToken, getUserFinancialData, extractUserProfile } from '../services/plaidService'
import { useUser } from '../contexts/UserContext'

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
      <div className="login-container">
        <motion.div 
          className="login-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div 
            className="logo-section"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="app-logo">
              <span className="logo-text">AskCents</span>
              <div className="logo-icons">
                <span className="emoji">🎓</span>
                <span className="emoji">💸</span>
              </div>
            </div>
            <h1>Welcome to AskCents</h1>
            <p>Your AI-powered financial coach for students</p>
          </motion.div>

          {/* Plaid Authentication */}
          <motion.div 
            className="auth-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="auth-header">
              <h2>Sign in with your bank account</h2>
              <p>Securely connect your bank to get personalized financial insights</p>
            </div>

            {/* Security Features */}
            <div className="security-features">
              <div className="feature">
                <Shield className="feature-icon" />
                <span>Bank-level security</span>
              </div>
              <div className="feature">
                <Lock className="feature-icon" />
                <span>256-bit encryption</span>
              </div>
              <div className="feature">
                <CreditCard className="feature-icon" />
                <span>Read-only access</span>
              </div>
            </div>

            {/* Plaid Connect Button */}
            <motion.button
              className="plaid-connect-btn"
              onClick={handlePlaidLogin}
              disabled={!ready || isConnecting}
              whileHover={ready && !isConnecting ? { scale: 1.02 } : {}}
              whileTap={ready && !isConnecting ? { scale: 0.98 } : {}}
            >
              {isConnecting ? (
                <>
                  <Loader className="loading-icon" />
                  Connecting to your bank...
                </>
              ) : !ready ? (
                <>
                  <Loader className="loading-icon" />
                  Initializing secure connection...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Connect Bank Account
                  <ChevronRight size={20} />
                </>
              )}
            </motion.button>

            {/* Connection Error */}
            {connectionError && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {connectionError}
              </motion.div>
            )}

            {/* Benefits */}
            <div className="benefits">
              <h3>What you'll get:</h3>
              <ul>
                <li>
                  <TrendingUp size={16} />
                  <span>Personalized spending insights</span>
                </li>
                <li>
                  <TrendingUp size={16} />
                  <span>Smart saving recommendations</span>
                </li>
                <li>
                  <TrendingUp size={16} />
                  <span>AI-powered financial coaching</span>
                </li>
              </ul>
            </div>

            {/* Demo Option */}
            <motion.div 
              className="demo-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="divider">
                <span>or</span>
              </div>
              <button
                type="button"
                className="demo-btn"
                onClick={handleDemoLogin}
                disabled={isConnecting}
              >
                Try Demo Mode (No Bank Required)
              </button>
              <p className="demo-note">
                Explore AskCents with sample data - you can connect your bank later
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginScreen
