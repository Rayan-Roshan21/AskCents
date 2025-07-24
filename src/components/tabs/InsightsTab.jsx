import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, PieChart, DollarSign, Target, Coffee, Home, ShoppingBag, Car, Lightbulb, ChevronRight } from 'lucide-react'

const InsightsTab = ({ user }) => {
  const [timeRange, setTimeRange] = useState('month')
  
  // Mock data - in real app this would come from bank integration
  const spendingData = {
    categories: [
      { name: 'Food & Dining', amount: 450, percentage: 32, icon: Coffee, color: 'mint', trend: '+5%' },
      { name: 'Rent & Housing', amount: 800, percentage: 55, icon: Home, color: 'navy', trend: '0%' },
      { name: 'Shopping', amount: 120, percentage: 8, icon: ShoppingBag, color: 'beige', trend: '-12%' },
      { name: 'Transportation', amount: 80, percentage: 5, icon: Car, color: 'mint', trend: '+2%' }
    ],
    totalSpent: 1450,
    totalIncome: 1800,
    savingsRate: 19.4
  }

  const savingsGrowth = [
    { month: 'Jan', amount: 200 },
    { month: 'Feb', amount: 350 },
    { month: 'Mar', amount: 480 },
    { month: 'Apr', amount: 650 },
    { month: 'May', amount: 820 }
  ]

  const microInvestmentPotential = {
    coffeeSpend: 85,
    potentialInvestment: 60,
    projectedGrowth: 720 // annual
  }

  const financialHealth = {
    score: 68,
    status: 'Good',
    color: 'mint',
    factors: [
      { name: 'Savings Rate', score: 75, status: 'Good' },
      { name: 'Spending Control', score: 60, status: 'Okay' },
      { name: 'Emergency Fund', score: 45, status: 'Needs Work' },
      { name: 'Debt Management', score: 85, status: 'Excellent' }
    ]
  }

  const dailyTip = {
    title: "Smart tip of the day",
    content: "You spent $15 more on coffee this week than usual. Brewing at home 2 days could save you $120/year!",
    icon: Lightbulb,
    actionText: "Show me how"
  }

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
          <p>Your financial overview for this {timeRange}</p>
        </motion.div>

        <div className="time-selector">
          {['week', 'month', 'year'].map((period) => (
            <motion.button
              key={period}
              className={`time-btn ${timeRange === period ? 'active' : ''}`}
              onClick={() => setTimeRange(period)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {period}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div 
        className="insights-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Quick Stats */}
        <motion.div className="stats-row" variants={itemVariants}>
          <div className="stat-card income">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <span className="stat-label">Income</span>
              <span className="stat-value">${spendingData.totalIncome}</span>
            </div>
          </div>
          
          <div className="stat-card spending">
            <div className="stat-icon">
              <PieChart />
            </div>
            <div className="stat-content">
              <span className="stat-label">Spent</span>
              <span className="stat-value">${spendingData.totalSpent}</span>
            </div>
          </div>
          
          <div className="stat-card savings">
            <div className="stat-icon">
              <Target />
            </div>
            <div className="stat-content">
              <span className="stat-label">Saved</span>
              <span className="stat-value">{spendingData.savingsRate}%</span>
            </div>
          </div>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div className="insight-card spending-breakdown" variants={itemVariants}>
          <div className="card-header">
            <h3>Spending Breakdown</h3>
            <span className="card-subtitle">Where your money went</span>
          </div>
          
          <div className="categories-list">
            {spendingData.categories.map((category, index) => (
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
        </motion.div>

        {/* Micro-Investment Potential */}
        <motion.div className="insight-card micro-investment" variants={itemVariants}>
          <div className="card-header">
            <h3>Micro-Investment Potential</h3>
            <span className="card-subtitle">Small changes, big impact</span>
          </div>
          
          <div className="investment-content">
            <div className="investment-visual">
              <div className="coffee-spend">
                <Coffee className="coffee-icon" />
                <span>Monthly coffee: ${microInvestmentPotential.coffeeSpend}</span>
              </div>
              <ChevronRight className="arrow" />
              <div className="potential-investment">
                <TrendingUp className="invest-icon" />
                <span>Could invest: ${microInvestmentPotential.potentialInvestment}</span>
              </div>
            </div>
            
            <div className="projection">
              <span className="projection-label">Potential annual growth:</span>
              <span className="projection-value">${microInvestmentPotential.projectedGrowth}</span>
            </div>
            
            <motion.button 
              className="btn btn-mint"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start micro-investing
            </motion.button>
          </div>
        </motion.div>

        {/* Financial Health */}
        <motion.div className="insight-card financial-health" variants={itemVariants}>
          <div className="card-header">
            <h3>Financial Health</h3>
            <span className="card-subtitle">You're on track!</span>
          </div>
          
          <div className="health-score">
            <div className="score-circle">
              <motion.div
                className="score-progress"
                initial={{ rotate: 0 }}
                animate={{ rotate: (financialHealth.score / 100) * 360 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
              <div className="score-content">
                <span className="score-number">{financialHealth.score}</span>
                <span className="score-status">{financialHealth.status}</span>
              </div>
            </div>
            
            <div className="health-factors">
              {financialHealth.factors.map((factor, index) => (
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
            <motion.button 
              className="tip-action"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {dailyTip.actionText}
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default InsightsTab
