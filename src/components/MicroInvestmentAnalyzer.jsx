import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Target, Calculator, Coffee, ShoppingBag, Car, Utensils } from 'lucide-react'

const MicroInvestmentAnalyzer = ({ transactions = [], accounts = [] }) => {
  const [selectedCategories, setSelectedCategories] = useState(['FOOD_AND_DRINK', 'ENTERTAINMENT'])
  const [targetSavingsRate, setTargetSavingsRate] = useState(15) // 15% default
  const [investmentReturn, setInvestmentReturn] = useState(7) // 7% annual return

  // Analyze transactions for micro-investment opportunities
  const analyzeTransactions = () => {
    if (!transactions.length) return null

    const categoryMap = {
      'FOOD_AND_DRINK': { icon: Coffee, name: 'Food & Dining', color: 'mint' },
      'ENTERTAINMENT': { icon: Car, name: 'Entertainment', color: 'beige' },
      'GENERAL_MERCHANDISE': { icon: ShoppingBag, name: 'Shopping', color: 'navy' },
      'TRANSPORTATION': { icon: Car, name: 'Transportation', color: 'gray' }
    }

    // Group transactions by category
    const categorySpending = {}
    let totalSpending = 0

    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        const category = transaction.personal_finance_category?.primary || 'OTHER'
        const amount = transaction.amount

        if (!categorySpending[category]) {
          categorySpending[category] = {
            category,
            name: categoryMap[category]?.name || category.replace(/_/g, ' '),
            icon: categoryMap[category]?.icon || DollarSign,
            color: categoryMap[category]?.color || 'gray',
            total: 0,
            transactions: []
          }
        }

        categorySpending[category].total += amount
        categorySpending[category].transactions.push(transaction)
        totalSpending += amount
      }
    })

    return { categorySpending, totalSpending }
  }

  const analysis = analyzeTransactions()

  if (!analysis) {
    return (
      <div className="micro-investment-analyzer">
        <div className="analyzer-header">
          <h3>Micro-Investment Analyzer</h3>
          <p>Connect your bank account to see personalized investment opportunities</p>
        </div>
      </div>
    )
  }

  const { categorySpending, totalSpending } = analysis

  // Calculate potential savings for selected categories
  const calculatePotential = () => {
    let selectedSpending = 0
    selectedCategories.forEach(categoryKey => {
      if (categorySpending[categoryKey]) {
        selectedSpending += categorySpending[categoryKey].total
      }
    })

    const monthlySavings = Math.round(selectedSpending * (targetSavingsRate / 100))
    const annualSavings = monthlySavings * 12
    
    // Calculate compound growth over different time periods
    const calculateCompoundGrowth = (months) => {
      const monthlyRate = investmentReturn / 100 / 12
      let balance = 0
      for (let i = 0; i < months; i++) {
        balance = (balance + monthlySavings) * (1 + monthlyRate)
      }
      return Math.round(balance)
    }

    return {
      selectedSpending: Math.round(selectedSpending),
      monthlySavings,
      annualSavings,
      projectedGrowth: {
        oneYear: calculateCompoundGrowth(12),
        threeYears: calculateCompoundGrowth(36),
        fiveYears: calculateCompoundGrowth(60)
      }
    }
  }

  const potential = calculatePotential()

  const toggleCategory = (categoryKey) => {
    setSelectedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    )
  }

  return (
    <div className="micro-investment-analyzer">
      <div className="analyzer-header">
        <h3>Micro-Investment Analyzer</h3>
        <p>Discover investment opportunities in your spending patterns</p>
      </div>

      {/* Category Selection */}
      <div className="category-selection">
        <h4>Select categories to optimize:</h4>
        <div className="category-grid">
          {Object.entries(categorySpending)
            .filter(([_, data]) => data.total > 0)
            .sort(([_, a], [__, b]) => b.total - a.total)
            .slice(0, 6)
            .map(([categoryKey, data]) => (
              <motion.div
                key={categoryKey}
                className={`category-card ${selectedCategories.includes(categoryKey) ? 'selected' : ''}`}
                onClick={() => toggleCategory(categoryKey)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <data.icon size={24} />
                <div className="category-info">
                  <span className="name">{data.name}</span>
                  <span className="amount">${Math.round(data.total)}/month</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Investment Controls */}
      <div className="investment-controls">
        <div className="control-group">
          <label>Target savings rate: {targetSavingsRate}%</label>
          <input
            type="range"
            min="5"
            max="30"
            value={targetSavingsRate}
            onChange={(e) => setTargetSavingsRate(Number(e.target.value))}
            className="slider"
          />
        </div>
        
        <div className="control-group">
          <label>Expected annual return: {investmentReturn}%</label>
          <input
            type="range"
            min="3"
            max="12"
            value={investmentReturn}
            onChange={(e) => setInvestmentReturn(Number(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      {/* Results */}
      <div className="investment-results">
        <div className="results-header">
          <Calculator size={20} />
          <h4>Your Micro-Investment Potential</h4>
        </div>

        <div className="results-grid">
          <div className="result-card">
            <span className="label">Monthly spending (selected)</span>
            <span className="value">${potential.selectedSpending}</span>
          </div>
          
          <div className="result-card highlight">
            <span className="label">Monthly investment potential</span>
            <span className="value">${potential.monthlySavings}</span>
          </div>
          
          <div className="result-card">
            <span className="label">1 year growth</span>
            <span className="value">${potential.projectedGrowth.oneYear}</span>
          </div>
          
          <div className="result-card">
            <span className="label">3 year growth</span>
            <span className="value">${potential.projectedGrowth.threeYears}</span>
          </div>
          
          <div className="result-card">
            <span className="label">5 year growth</span>
            <span className="value">${potential.projectedGrowth.fiveYears}</span>
          </div>
        </div>

        {potential.monthlySavings > 0 && (
          <div className="investment-tip">
            <Target size={16} />
            <p>
              By reducing your selected spending by {targetSavingsRate}%, you could invest 
              ${potential.monthlySavings} monthly. With a {investmentReturn}% annual return, 
              this could grow to ${potential.projectedGrowth.fiveYears} in 5 years!
            </p>
          </div>
        )}

        <div className="action-buttons">
          <motion.button
            className="btn btn-mint"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Set up auto-investing
          </motion.button>
          
          <motion.button
            className="btn btn-outline"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create budget goals
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default MicroInvestmentAnalyzer
