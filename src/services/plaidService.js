// Plaid Service for handling bank account linking via backend API
// This service communicates with our Node.js backend that handles Plaid API calls securely

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Generate a unique user ID for this session
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

// Store user ID in session storage
const getUserId = () => {
  let userId = sessionStorage.getItem('askcents_user_id')
  if (!userId) {
    userId = generateUserId()
    sessionStorage.setItem('askcents_user_id', userId)
  }
  return userId
}

// API Functions

// Create a link token for Plaid Link initialization
export const createLinkToken = async () => {
  try {
    console.log('Creating link token with API URL:', API_BASE_URL)
    const response = await fetch(`${API_BASE_URL}/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: getUserId()
      })
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to create link token - Response:', errorText)
      throw new Error(`Failed to create link token: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Link token created successfully:', data)
    return {
      success: true,
      link_token: data.link_token,
      expiration: data.expiration
    }
  } catch (error) {
    console.error('Error creating link token:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Exchange public token for access token
export const exchangePublicToken = async (publicToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/set_access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_token: publicToken,
        user_id: getUserId()
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to exchange token: ${errorData.error}`)
    }

    const data = await response.json()
    return {
      success: true,
      access_token: data.access_token,
      item_id: data.item_id
    }
  } catch (error) {
    console.error('Error exchanging public token:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get user accounts
export const getAccounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to get accounts - Response:', errorText)
      throw new Error(`Failed to get accounts: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      accounts: data.accounts,
      item: data.item
    }
  } catch (error) {
    console.error('Error getting accounts:', error)
    return {
      success: false,
      error: error.message
    }
  }

}

// Get user identity information
export const getIdentity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/identity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to get identity - Response:', errorText)
      throw new Error(`Failed to get identity: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      identity: data.identity,
      accounts: data.accounts
    }
  } catch (error) {
    console.error('Error getting identity:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get user transactions
export const getTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to get transactions - Response:', errorText)
      throw new Error(`Failed to get transactions: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      transactions: data.latest_transactions || []
    }
  } catch (error) {
    console.error('Error getting transactions:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Remove/disconnect bank account
export const removeItem = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/item/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: getUserId()
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to remove item: ${errorData.error}`)
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error removing item:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Simulate Plaid Link flow (for backward compatibility with existing UI)
// This now uses the real Plaid API via backend
export const simulatePlaidLink = async (institutionName) => {
  try {
    // Step 1: Create a link token
    const linkTokenResult = await createLinkToken()
    
    if (!linkTokenResult.success) {
      return {
        success: false,
        error: 'Failed to initialize Plaid Link: ' + linkTokenResult.error
      }
    }

    // In a real implementation, you would open Plaid Link here
    // For now, we'll simulate a successful connection
    console.log('🔗 Plaid Link would open here with token:', linkTokenResult.link_token)
    
    // Simulate user completing Plaid Link and getting a public token
    // In reality, this would come from the Plaid Link onSuccess callback
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock public token (in real app, this comes from Plaid Link)
    const mockPublicToken = 'public-sandbox-' + Date.now() + '-mock'
    
    // Step 2: Exchange public token for access token
    const exchangeResult = await exchangePublicToken(mockPublicToken)
    
    if (!exchangeResult.success) {
      return {
        success: false,
        error: 'Failed to exchange token: ' + exchangeResult.error
      }
    }

    // Step 3: Get account information
    const accountsResult = await getAccounts()
    
    if (!accountsResult.success) {
      return {
        success: false,
        error: 'Failed to get accounts: ' + accountsResult.error
      }
    }

    return {
      success: true,
      institution: institutionName,
      accounts: accountsResult.accounts,
      access_token: exchangeResult.access_token,
      item_id: exchangeResult.item_id,
      public_token: mockPublicToken
    }
  } catch (error) {
    console.error('Error in Plaid Link simulation:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Backward compatibility functions for existing UI
export const getSandboxInstitutions = () => {
  // Common sandbox institutions that work with Plaid
  return [
    { name: 'First Platypus Bank', id: 'ins_109508' },
    { name: 'First Gingham Credit Union', id: 'ins_109509' },
    { name: 'Tartan Bank', id: 'ins_109510' },
    { name: 'Houndstooth Bank', id: 'ins_109511' },
    { name: 'Tattersall Federal Credit Union', id: 'ins_109512' },
    { name: 'Chase', id: 'ins_56' }, // Real institution for testing
    { name: 'Wells Fargo', id: 'ins_5' }, // Real institution for testing
    { name: 'Bank of America', id: 'ins_6' } // Real institution for testing
  ]
}

export const getConnectionStatus = () => {
  return {
    isDemo: false,
    environment: 'sandbox',
    note: 'Connected to real Plaid API via secure backend server.'
  }
}

// Health check for backend API
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`)
    }
    const data = await response.json()
    return {
      success: true,
      status: data.status,
      timestamp: data.timestamp
    }
  } catch (error) {
    console.error('Backend health check failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
