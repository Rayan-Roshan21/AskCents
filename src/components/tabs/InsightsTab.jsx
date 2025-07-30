import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, PieChart, DollarSign, Target, Coffee, Home, ShoppingBag, Car, Lightbulb, ChevronRight, CreditCard, Building2, Wallet, Banknote, Landmark } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'

const InsightsTab = () => {
  const { user, plaidData } = useUser()
  const [timeRange, setTimeRange] = useState('month')
  const [spendingData, setSpendingData] = useState(null)
  const [financialHealth, setFinancialHealth] = useState(null)

  // Process Plaid data when available
  useEffect(() => {
    if (plaidData && plaidData.accounts && plaidData.transactions) {
      processPlaidData()
    }
  }, [plaidData, timeRange])

  const processPlaidData = () => {
    const accounts = plaidData.accounts || []
    const transactions = plaidData.transactions || []
    
    // Calculate account balances
    const totalBalance = accounts.reduce((sum, account) => {
      return sum + (account.balances?.current || 0)
    }, 0)

    // Process transactions for spending insights using personal_finance_category
    const categoryMap = {
      'FOOD_AND_DRINK': { icon: Coffee, color: 'mint', name: 'Food & Dining' },
      'GENERAL_MERCHANDISE': { icon: ShoppingBag, color: 'beige', name: 'Shopping' },
      'TRANSPORTATION': { icon: Car, color: 'navy', name: 'Transportation' },
      'RENT_AND_UTILITIES': { icon: Home, color: 'gray', name: 'Bills & Utilities' },
      'TRANSFER_IN': { icon: DollarSign, color: 'mint', name: 'Transfers' },
      'TRANSFER_OUT': { icon: DollarSign, color: 'mint', name: 'Transfers' },
      'ENTERTAINMENT': { icon: Coffee, color: 'beige', name: 'Entertainment' },
      'TRAVEL': { icon: Car, color: 'navy', name: 'Travel' },
      'HEALTHCARE': { icon: Home, color: 'gray', name: 'Healthcare' },
      'BANK_FEES': { icon: DollarSign, color: 'gray', name: 'Bank Fees' },
      'PERSONAL_CARE': { icon: ShoppingBag, color: 'beige', name: 'Personal Care' }
    }

    // Group transactions by personal_finance_category
    const categorySpending = {}
    let totalSpent = 0

    transactions.forEach(transaction => {
      if (transaction.amount > 0) { // Spending transactions
        const primaryCategory = transaction.personal_finance_category?.primary || 'OTHER'
        const categoryInfo = categoryMap[primaryCategory] || { icon: DollarSign, color: 'gray', name: primaryCategory.replace(/_/g, ' ') }
        
        if (!categorySpending[primaryCategory]) {
          categorySpending[primaryCategory] = {
            name: categoryInfo.name,
            amount: 0,
            icon: categoryInfo.icon,
            color: categoryInfo.color,
            transactions: []
          }
        }
        
        categorySpending[primaryCategory].amount += transaction.amount
        categorySpending[primaryCategory].transactions.push(transaction)
        totalSpent += transaction.amount
      }
    })

    // Convert to array and calculate percentages
    const categories = Object.values(categorySpending)
      .map(cat => ({
        ...cat,
        percentage: totalSpent > 0 ? Math.round((cat.amount / totalSpent) * 100) : 0,
        trend: '+0%' // Could calculate based on historical data
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6) // Top 6 categories

    setSpendingData({
      categories,
      totalSpent: Math.round(totalSpent),
      totalBalance: Math.round(totalBalance),
      accountCount: accounts.length,
      transactionCount: transactions.length
    })

    // Calculate financial health score
    const savingsRate = totalBalance > 0 ? Math.min(100, Math.round((totalBalance / Math.max(totalSpent, 1)) * 10)) : 0
    const spendingControl = Math.max(0, 100 - Math.min(100, (totalSpent / Math.max(totalBalance, 1000)) * 50))
    
    setFinancialHealth({
      score: Math.round((savingsRate + spendingControl) / 2),
      status: savingsRate > 60 ? 'Good' : savingsRate > 30 ? 'Okay' : 'Needs Work',
      color: savingsRate > 60 ? 'mint' : savingsRate > 30 ? 'beige' : 'gray',
      factors: [
        { name: 'Account Balance', score: Math.min(100, savingsRate), status: savingsRate > 60 ? 'Good' : 'Needs Work' },
        { name: 'Spending Control', score: Math.round(spendingControl), status: spendingControl > 70 ? 'Good' : 'Okay' },
        { name: 'Active Accounts', score: Math.min(100, accounts.length * 25), status: accounts.length >= 2 ? 'Good' : 'Okay' },
        { name: 'Transaction Activity', score: Math.min(100, transactions.length), status: transactions.length > 10 ? 'Good' : 'Okay' }
      ]
    })
  }

  // Fallback to mock data if no Plaid data
  const getMockData = () => ({
    categories: [
      { name: 'Food & Dining', amount: 450, percentage: 32, icon: Coffee, color: 'mint', trend: '+5%' },
      { name: 'Rent & Housing', amount: 800, percentage: 55, icon: Home, color: 'navy', trend: '0%' },
      { name: 'Shopping', amount: 120, percentage: 8, icon: ShoppingBag, color: 'beige', trend: '-12%' },
      { name: 'Transportation', amount: 80, percentage: 5, icon: Car, color: 'mint', trend: '+2%' }
    ],
    totalSpent: 1450,
    totalBalance: 1800,
    accountCount: 2,
    transactionCount: 45
  })

  const getMockHealthData = () => ({
    score: 68,
    status: 'Good',
    color: 'mint',
    factors: [
      { name: 'Savings Rate', score: 75, status: 'Good' },
      { name: 'Spending Control', score: 60, status: 'Okay' },
      { name: 'Emergency Fund', score: 45, status: 'Needs Work' },
      { name: 'Debt Management', score: 85, status: 'Excellent' }
    ]
  })

  const currentSpendingData = spendingData || getMockData()
  const currentHealthData = financialHealth || getMockHealthData()
  const hasPlaidData = !!plaidData && !!spendingData

  // Get appropriate icon for account type
  const getAccountIcon = (account) => {
    const { type, subtype } = account
    
    if (type === 'depository') {
      if (subtype === 'checking') return Wallet
      if (subtype === 'savings') return Banknote
      return Building2
    }
    
    if (type === 'credit') return CreditCard
    if (type === 'investment') return TrendingUp
    if (type === 'loan') return Home
    
    return Landmark // Default bank icon
  }

  // Get account color based on type
  const getAccountColor = (account) => {
    const { type, subtype } = account
    
    if (type === 'depository') {
      if (subtype === 'checking') return 'mint'
      if (subtype === 'savings') return 'navy'
      return 'beige'
    }
    
    if (type === 'credit') return 'gray'
    if (type === 'investment') return 'mint'
    if (type === 'loan') return 'navy'
    
    return 'beige'
  }

  // Generate savings growth projection based on current balance and interest rate
  const generateSavingsProjection = () => {
    const currentBalance = currentSpendingData.totalBalance || 1000
    const monthlyContribution = Math.round(currentBalance * 0.1) // 10% of current balance as monthly contribution
    const annualInterestRate = 0.045 // 4.5% APY (typical high-yield savings)
    const monthlyInterestRate = annualInterestRate / 12
    
    const currentDate = new Date()
    const months = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i)
      months.push(date.toLocaleDateString('en-US', { month: 'short' }))
    }
    let balance = currentBalance
    
    return months.map((month, index) => {
      if (index > 0) {
      // Add monthly contribution and compound interest
      balance = (balance + monthlyContribution) * (1 + monthlyInterestRate)
      }
      return {
      month,
      amount: Math.round(balance),
      contribution: index === 0 ? 0 : monthlyContribution,
      interest: index === 0 ? 0 : Math.round(balance * monthlyInterestRate)
      }
    })
    }

    const savingsGrowth = generateSavingsProjection()
    
    // Savings simulator state
    const [simulatorData, setSimulatorData] = useState({
    monthlyContribution: 200,
    interestRate: 4.5,
    timeframe: 12
    })

    const calculateProjectedGrowth = (contribution, rate, months) => {
    const currentBalance = currentSpendingData.totalBalance || 1000
    const monthlyRate = rate / 100 / 12
    let balance = currentBalance
    const projectionData = []
    
    for (let i = 0; i <= months; i++) {
      if (i > 0) {
      balance = (balance + contribution) * (1 + monthlyRate)
      }
      projectionData.push({
      month: i,
      amount: Math.round(balance)
      })
    }
    
    return projectionData
    }

    const projectionData = calculateProjectedGrowth(
    simulatorData.monthlyContribution,
    simulatorData.interestRate,
    simulatorData.timeframe
    )

    const maxAmount = Math.max(...projectionData.map(point => point.amount))

  // Calculate micro-investment potential from real transactions
  const calculateMicroInvestmentPotential = () => {
    if (!hasPlaidData || !currentSpendingData.categories.length) {
      return {
        coffeeSpend: 150,
        potentialInvestment: 120,
        projectedGrowth: 1440,
        targetCategory: 'Coffee & Dining',
        isRealData: false
      }
    }

    // Find spending patterns suitable for micro-investing
    const targetCategories = ['FOOD_AND_DRINK', 'ENTERTAINMENT', 'GENERAL_MERCHANDISE']
    let totalTargetSpending = 0
    let primaryCategory = null
    let primaryAmount = 0

    currentSpendingData.categories.forEach(category => {
      // Check if category matches our target categories for micro-investing
      const isTargetCategory = targetCategories.some(target => 
        category.name.toLowerCase().includes(target.toLowerCase().replace('_', ' ')) ||
        category.name.toLowerCase().includes('food') ||
        category.name.toLowerCase().includes('coffee') ||
        category.name.toLowerCase().includes('entertainment') ||
        category.name.toLowerCase().includes('shopping')
      )
      
      if (isTargetCategory) {
        totalTargetSpending += category.amount
        if (category.amount > primaryAmount) {
          primaryAmount = category.amount
          primaryCategory = category.name
        }
      }
    })

    // Calculate potential savings (10-20% reduction in discretionary spending)
    const potentialReduction = Math.round(totalTargetSpending * 0.15) // 15% reduction
    const monthlyInvestment = Math.max(potentialReduction, 25) // Minimum $25/month
    
    // Calculate projected annual growth at 7% return
    const annualGrowth = Math.round(monthlyInvestment * 12 * 1.07) // Conservative 7% return
    
    return {
      coffeeSpend: Math.round(primaryAmount || totalTargetSpending),
      potentialInvestment: monthlyInvestment,
      projectedGrowth: annualGrowth,
      targetCategory: primaryCategory || 'Discretionary Spending',
      totalDiscretionary: Math.round(totalTargetSpending),
      isRealData: true,
      savingsRate: Math.round((potentialReduction / totalTargetSpending) * 100) || 15
    }
  }

  const microInvestmentPotential = calculateMicroInvestmentPotential()

  // Generate dynamic tip based on real data
  const getDynamicTip = () => {
    if (!hasPlaidData) {
      return {
        title: "Connect your bank for personalized tips",
        content: "Link your bank account to get AI-powered insights based on your real spending patterns!",
        icon: Lightbulb,
        actionText: "Connect Bank"
      }
    }

    const topCategory = currentSpendingData.categories[0]
    const microData = microInvestmentPotential
    
    // Prioritize micro-investing tips if there's good potential
    if (microData.isRealData && microData.potentialInvestment >= 50) {
      return {
        title: "💰 Micro-investing opportunity detected!",
        content: `You spend $${microData.coffeeSpend}/month on ${microData.targetCategory.toLowerCase()}. By cutting just ${microData.savingsRate}%, you could invest $${microData.potentialInvestment}/month and potentially grow it to $${microData.projectedGrowth} annually!`,
        icon: TrendingUp,
        actionText: "Start Investing"
      }
    }
    
    // Budget optimization tip
    if (topCategory) {
      return {
        title: "Smart tip based on your spending",
        content: `Your biggest expense is ${topCategory.name} at $${topCategory.amount}. Consider setting a monthly budget of $${Math.round(topCategory.amount * 0.9)} to save $${Math.round(topCategory.amount * 0.1)}/month!`,
        icon: Lightbulb,
        actionText: "Set Budget"
      }
    }

    return {
      title: "You're doing great!",
      content: "Keep tracking your expenses and you'll reach your financial goals faster.",
      icon: Lightbulb,
      actionText: "Learn More"
    }
  }

  const dailyTip = getDynamicTip()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="insights-tab">
      {/* Header */}
      <div className="insights-header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>My Money Snapshot</h1>
          <p>
            Your financial overview for this {timeRange}
          </p>
        </motion.div>

      </div>

      <motion.div 
        className="insights-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Quick Stats */}
        <motion.div className="stats-row" variants={itemVariants}>
          <div className="stat-card balance">
            <div className="stat-icon">
              <DollarSign />
            </div>
            <div className="stat-content">
              <span className="stat-label">{hasPlaidData ? 'Total Balance' : 'Balance'}</span>
              <span className="stat-value">${currentSpendingData.totalBalance?.toLocaleString() || '0'}</span>
            </div>
          </div>
          
          <div className="stat-card spending">
            <div className="stat-icon">
              <PieChart />
            </div>
            <div className="stat-content">
              <span className="stat-label">Spent</span>
              <span className="stat-value">${currentSpendingData.totalSpent?.toLocaleString() || '0'}</span>
            </div>
          </div>
          
          <div className="stat-card accounts">
            <div className="stat-icon">
              <Building2 />
            </div>
            <div className="stat-content">
              <span className="stat-label">{hasPlaidData ? 'Accounts' : 'Connected'}</span>
              <span className="stat-value">{currentSpendingData.accountCount || 0}</span>
            </div>
          </div>

          {hasPlaidData && (
            <div className="stat-card transactions">
              <div className="stat-icon">
                <TrendingUp />
              </div>
              <div className="stat-content">
                <span className="stat-label">Transactions</span>
                <span className="stat-value">{currentSpendingData.transactionCount || 0}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div className="insight-card spending-breakdown" variants={itemVariants}>
          <div className="card-header">
            <h3>Spending Breakdown</h3>
            <span className="card-subtitle">
              {hasPlaidData ? 'Where your money went' : 'Sample spending breakdown'}
            </span>
          </div>
          
          <div className="categories-list">
            {currentSpendingData.categories.map((category, index) => (
              <motion.div
                key={category.name}
                className="category-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div className="category-icon">
                  <category.icon />
                </div>
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <div className="category-progress">
                    <div className="progress-track">
                      <motion.div
                        className={`progress-fill ${category.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      />
                    </div>
                    <span className="percentage">{category.percentage}%</span>
                  </div>
                </div>
                <div className="category-amount">
                  <span className="amount">${category.amount}</span>
                  <span className={`trend ${category.trend.startsWith('+') ? 'up' : 'down'}`}>
                    {category.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Accounts Overview */}
        {hasPlaidData && plaidData.accounts && (
          <motion.div className="insight-card accounts-overview" variants={itemVariants}>
            <div className="card-header">
              <h3>Your Accounts</h3>
              <span className="card-subtitle">Connected financial accounts</span>
            </div>
            
            <div className="accounts-list">
              {plaidData.accounts.map((account, index) => {
                const AccountIcon = getAccountIcon(account)
                const accountColor = getAccountColor(account)
                const balance = account.balances?.current || 0
                const accountName = account.name || `${account.subtype} Account`
                
                return (
                  <motion.div
                    key={account.account_id}
                    className="account-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <div className={`account-icon ${accountColor}`}>
                      <AccountIcon size={20} />
                    </div>
                    <div className="account-info">
                      <span className="account-name">{accountName}</span>
                      <span className="account-type">
                        {account.subtype?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="account-balance">
                      <span className="balance">${Math.abs(balance).toLocaleString()}</span>
                      {account.type === 'credit' && balance > 0 && (
                        <span className="balance-note">Outstanding</span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Savings Growth */}
        <motion.div className="insight-card savings-growth" variants={itemVariants}>
          <div className="card-header">
            <h3>Savings Growth</h3>
            <span className="card-subtitle">Building your future</span>
          </div>
          
          <div className="growth-chart">
            {savingsGrowth.map((point, index) => (
              <motion.div
                key={point.month}
                className="chart-bar"
                initial={{ height: 0 }}
                animate={{ height: `${(point.amount / 1000) * 100}%` }}
                transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
              >
                <div className="bar-fill" />
                <span className="bar-label">{point.month}</span>
                <span className="bar-value">${point.amount}</span>
              </motion.div>
            ))}
          </div>
          <div className="growth-projection">
            <span className="projection-label">Projected growth over next 12 months:</span>
            <span className="projection-value">{` Contribute ${Math.round(currentSpendingData.totalBalance * 0.1) || 100} monthly at 4.5% interest`}</span>
          </div>
        </motion.div>

        {/* Micro-Investment Potential */}
        <motion.div className="insight-card micro-investment" variants={itemVariants}>
          <div className="card-header">
            <h3>Micro-Investment Potential</h3>
            <span className="card-subtitle">
              {microInvestmentPotential.isRealData 
          ? 'Based on your spending patterns' 
          : 'Small changes, big impact'}
            </span>
          </div>
          
          <div className="investment-content">
            <div className="investment-visual">
              <div className="coffee-spend">
          <DollarSign className="coffee-icon" />
          <div className="spend-details">
            <span className="category-name">{microInvestmentPotential.targetCategory}</span>
            <span className="amount">${microInvestmentPotential.coffeeSpend}/month</span>
          </div>
              </div>
              <ChevronRight className="arrow" />
              <div className="potential-investment">
          <TrendingUp className="invest-icon" />
          <div className="invest-details">
            <span className="invest-label">Could invest</span>
            <span className="invest-amount">${microInvestmentPotential.potentialInvestment}/month</span>
          </div>
              </div>
            </div>
            
            {microInvestmentPotential.isRealData && (
              <div className="investment-breakdown">
          <div className="breakdown-item">
            <span className="label">Total discretionary spending:</span>
            <span className="value">${microInvestmentPotential.totalDiscretionary}</span>
          </div>
          <div className="breakdown-item">
            <span className="label">Potential savings rate:</span>
            <span className="value">{microInvestmentPotential.savingsRate}%</span>
          </div>
              </div>
            )}
            
            <div className="projection">
              <span className="projection-label">Potential annual growth (7% return):</span>
              <span className="projection-value">${microInvestmentPotential.projectedGrowth}</span>
            </div>
            
            <div className="investment-tips">
              {microInvestmentPotential.isRealData ? (
          <p className="tip-text">
            💡 By reducing your {microInvestmentPotential.targetCategory.toLowerCase()} spending by just {microInvestmentPotential.savingsRate}%, 
            you could invest ${microInvestmentPotential.potentialInvestment} monthly and potentially grow it to ${microInvestmentPotential.projectedGrowth} in a year!
          </p>
              ) : (
          <p className="tip-text">
            💡 Connect your bank account to see personalized micro-investing opportunities based on your actual spending!
          </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Financial Health */}
        <motion.div className="insight-card financial-health" variants={itemVariants}>
          <div className="card-header">
            <h3>Financial Health</h3>
            <span className="card-subtitle">Your overall financial wellness</span>

          </div>
          
          <div className="health-score">
            <div className="score-circle">
              <motion.div
                className="score-progress"
                initial={{ rotate: 0 }}
                animate={{ rotate: (currentHealthData.score / 100) * 360 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
              <div className="score-content">
                <span className="score-number">{currentHealthData.score}</span>
                <span className="score-status">{currentHealthData.status}</span>
              </div>
            </div>
            
            <div className="health-factors">
              {currentHealthData.factors.map((factor, index) => (
                <motion.div
                  key={factor.name}
                  className="factor-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
                  <span className="factor-name">{factor.name}</span>
                  <div className="factor-score">
                    <div className="factor-bar">
                      <motion.div
                        className="factor-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.score}%` }}
                        transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
                      />
                    </div>
                    <span className="factor-status">{factor.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Daily Tip */}
        <motion.div className="insight-card daily-tip" variants={itemVariants}>
          <div className="tip-content">
            <div className="tip-icon">
              <dailyTip.icon />
            </div>
            <div className="tip-text">
              <h4>{dailyTip.title}</h4>
              <p>{dailyTip.content}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default InsightsTab
