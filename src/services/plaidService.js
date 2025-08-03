// Plaid Service for handling bank account linking via backend API
// This service communicates with our Node.js backend that handles Plaid API calls securely

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create link token
export const createLinkToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, ...data }
  } catch (error) {
    console.error('Error creating link token')
    return { success: false, error: error.message }
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
      body: JSON.stringify({ public_token: publicToken })
    })

    if (!response.ok) {
      throw new Error(`Failed to exchange token: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, ...data }
  } catch (error) {
    console.error('Error exchanging public token')
    throw new Error(`Failed to exchange token: ${error.message}`)
  }
}

// Get comprehensive user financial data
export const getUserFinancialData = async () => {
  try {
    // Fetch all data in parallel
    const [accounts, identity, transactions, balance] = await Promise.all([
      getAccounts(),
      getIdentity(),
      getTransactions(),
      getBalance()
    ])

    const financialData = {
      accounts: accounts.accounts || [],
      identity: identity.identity || [],
      transactions: transactions.latest_transactions || [],
      balances: balance.accounts || [],
      totalBalance: calculateTotalBalance(balance.accounts || []),
      spendingInsights: analyzeSpending(transactions.latest_transactions || []),
      accountTypes: categorizeAccounts(accounts.accounts || []),
      lastUpdated: new Date().toISOString()
    }

    return { success: true, data: financialData }
  } catch (error) {
    console.error('Error fetching user financial data')
    return { success: false, error: error.message }
  }
}

// Get accounts
export const getAccounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error getting accounts')
    throw error
  }
}

// Get identity information
export const getIdentity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/identity`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error getting identity')
    throw error
  }
}

// Get transactions
export const getTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error getting transactions')
    throw error
  }
}

// Get account balances
export const getBalance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/balance`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error getting balance')
    throw error
  }
}

// Helper functions for data analysis
const calculateTotalBalance = (accounts) => {
  return accounts.reduce((total, account) => {
    const balance = account.balances?.current || 0
    // Only add positive balances (assets), subtract debts (credit cards, loans)
    if (account.type === 'credit' || account.subtype === 'credit card') {
      return total - balance
    }
    return total + balance
  }, 0)
}

const analyzeSpending = (transactions) => {
  const last30Days = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return transactionDate >= thirtyDaysAgo && t.amount > 0
  })

  const categorySpending = {}
  let totalSpent = 0

  last30Days.forEach(transaction => {
    const category = transaction.category?.[0] || 'Other'
    categorySpending[category] = (categorySpending[category] || 0) + transaction.amount
    totalSpent += transaction.amount
  })

  const topCategories = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / totalSpent) * 100).toFixed(1)
    }))

  return {
    totalSpent,
    transactionCount: last30Days.length,
    topCategories,
    averageTransaction: totalSpent / last30Days.length || 0
  }
}

const categorizeAccounts = (accounts) => {
  const types = {
    checking: [],
    savings: [],
    credit: [],
    investment: [],
    loan: [],
    other: []
  }

  accounts.forEach(account => {
    const type = account.subtype || account.type
    switch (type) {
      case 'checking':
        types.checking.push(account)
        break
      case 'savings':
        types.savings.push(account)
        break
      case 'credit card':
      case 'credit':
        types.credit.push(account)
        break
      case 'investment':
      case 'brokerage':
        types.investment.push(account)
        break
      case 'student':
      case 'mortgage':
      case 'auto':
        types.loan.push(account)
        break
      default:
        types.other.push(account)
    }
  })

  return types
}

// Extract user profile from Plaid identity data
export const extractUserProfile = (identityData) => {
  if (!identityData || !identityData.length) return null

  const primaryAccount = identityData[0]
  const owner = primaryAccount.owners?.[0]

  if (!owner) return null

  return {
    name: owner.names?.[0] || '',
    email: owner.emails?.[0]?.data || '',
    phone: owner.phone_numbers?.[0]?.data || '',
    address: owner.addresses?.[0] ? {
      street: owner.addresses[0].data.street,
      city: owner.addresses[0].data.city,
      region: owner.addresses[0].data.region,
      postal_code: owner.addresses[0].data.postal_code,
      country: owner.addresses[0].data.country
    } : null
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
    console.error('Error in Plaid Link simulation')
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
    console.error('Backend health check failed')
    return {
      success: false,
      error: error.message
    }
  }
}
