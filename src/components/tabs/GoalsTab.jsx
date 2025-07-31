import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, TrendingUp, CreditCard, GraduationCap, Lock, CheckCircle, Calendar, DollarSign, Zap, Brain, Sparkles } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'

const GoalsTab = () => {
  const { user, plaidData } = useUser()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [selectedGoalType, setSelectedGoalType] = useState('')
  const [activeGoals, setActiveGoals] = useState([])
  const [weeklyGuidance, setWeeklyGuidance] = useState([])
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false)
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    description: ''
  })

  // Generate weekly advice using Gemini AI
  const generateWeeklyAdvice = async (transactions) => {
    try {
      setIsLoadingAdvice(true)
      
      // Check if we have cached advice for this week
      const currentWeek = getCurrentWeekKey()
      const cachedAdvice = localStorage.getItem(`weeklyAdvice_${currentWeek}`)
      
      if (cachedAdvice) {
        const parsedAdvice = JSON.parse(cachedAdvice)
        setWeeklyGuidance([{
          week: "This Week",
          tasks: parsedAdvice,
          generatedAt: new Date().toISOString(),
          isAIGenerated: true
        }])
        setIsLoadingAdvice(false)
        return
      }

      // Prepare transaction data for Gemini
      const transactionSummary = prepareTransactionData(transactions)
      
      // Call Gemini API
      const advice = await callGeminiAPI(transactionSummary)
      
      // Cache the advice
      localStorage.setItem(`weeklyAdvice_${currentWeek}`, JSON.stringify(advice))
      
      setWeeklyGuidance([{
        week: "This Week",
        tasks: advice,
        generatedAt: new Date().toISOString(),
        isAIGenerated: true
      }])
      
    } catch (error) {
      console.error('Error generating weekly advice:', error)
      
      // Provide specific error messages for different cases
      let errorMessage = 'Unable to generate personalized advice at this time'
      if (error.message === 'API key not configured') {
        errorMessage = 'AI advice requires API key configuration'
      } else if (error.message.includes('API returned')) {
        errorMessage = 'AI service is temporarily unavailable'
      }
      
      // Show error message instead of fallback advice
      setWeeklyGuidance([{
        week: "This Week",
        tasks: [],
        generatedAt: new Date().toISOString(),
        isAIGenerated: false,
        error: errorMessage,
        noAdvice: true
      }])
    } finally {
      setIsLoadingAdvice(false)
    }
  }

  // Get current week key for caching
  const getCurrentWeekKey = () => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const pastDaysOfYear = (now - startOfYear) / 86400000
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
    return `${now.getFullYear()}_W${weekNumber}`
  }

  // Prepare transaction data for Gemini
  const prepareTransactionData = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return "No recent transactions available."
    }

    // Get transactions from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentTransactions = transactions.filter(tx => 
      new Date(tx.date) >= thirtyDaysAgo
    )

    // Categorize and summarize transactions
    const categorySummary = {}
    let totalSpent = 0
    let incomeTotal = 0

    recentTransactions.forEach(tx => {
      const amount = Math.abs(tx.amount)
      const category = tx.category ? tx.category[0] : 'Other'
      
      if (tx.amount < 0) { // Spending
        totalSpent += amount
        categorySummary[category] = (categorySummary[category] || 0) + amount
      } else { // Income
        incomeTotal += amount
      }
    })

    // Get top 5 spending categories
    const topCategories = Object.entries(categorySummary)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount: amount.toFixed(2),
        percentage: ((amount / totalSpent) * 100).toFixed(1)
      }))

    return {
      totalSpent: totalSpent.toFixed(2),
      totalIncome: incomeTotal.toFixed(2),
      netCashFlow: (incomeTotal - totalSpent).toFixed(2),
      topSpendingCategories: topCategories,
      transactionCount: recentTransactions.length,
      timeframe: "Last 30 days"
    }
  }

  // Call Gemini API
  const callGeminiAPI = async (transactionSummary) => {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file')
      throw new Error('API key not configured')
    }

    const prompt = `You are AskCents, a friendly and knowledgeable financial advisor chatbot designed specifically for Canadian students and young adults. Your goal is to provide helpful, accurate, and easy-to-understand financial advice.

Context and Guidelines:
- User is a Canadian or American student/young adult (age 16-30)
- Prioritize Canadian financial products (TFSA, RRSP, OSAP, Canadian banks, etc.) but provide US alternatives when relevant
- Keep responses conversational, helpful, and concise
- Always be encouraging, supportive, and non-judgmental about financial situations
- Provide specific, actionable advice with clear next steps
- Use simple language and avoid complex financial jargon
- Include relevant examples when helpful

Special Considerations:
- Emergency situations: If user mentions financial crisis, job loss, or urgent money needs, prioritize immediate practical solutions
- Mental health: Be sensitive to financial stress and anxiety, offer reassurance and suggest professional help when appropriate
- Different income levels: Adapt advice for students with no income, part-time workers, or recent graduates
- Life stages: Consider if user is in high school, university, or early career
- Risk tolerance: Assess user's comfort level with different financial products
- Regional differences: Account for provincial differences in Canada (Quebec vs other provinces)
- Currency context: Clarify CAD vs USD when discussing amounts
- Legal and regulatory: Acknowledge limitations and suggest consulting licensed professionals for complex tax, legal, or investment advice
- International students: Consider unique challenges like limited credit history, SIN requirements, and temporary status
- Indigenous financial programs: Be aware of specific programs and considerations for Indigenous students
- Accessibility: Consider users with disabilities who may have different financial needs or government support options
- Family dynamics: Respect different family financial arrangements and cultural approaches to money
- Entrepreneurship: Provide guidance for students starting businesses or side hustles
- Technology and apps: Recommend legitimate Canadian financial apps and tools while warning about scams
- Privacy and security: Emphasize the importance of financial privacy and security practices
- Non-traditional situations: Handle questions about alternative living arrangements, gap years, international exchanges, etc.
- Debt management: Provide compassionate guidance for various types of debt (student loans, credit cards, family debt)
- Real estate: Discuss homeownership, renting, and housing costs relevant to young adults
- Insurance needs: Address basic insurance requirements for young adults (health, auto, renters)

FINANCIAL DATA ANALYSIS:
Based on the following transaction analysis from the user's banking data (${transactionSummary.timeframe}):

- Total Spent: $${transactionSummary.totalSpent}
- Total Income: $${transactionSummary.totalIncome}
- Net Cash Flow: $${transactionSummary.netCashFlow}
- Top Spending Categories: ${transactionSummary.topSpendingCategories.map(cat => `${cat.category}: $${cat.amount} (${cat.percentage}%)`).join(', ')}
- Transaction Count: ${transactionSummary.transactionCount}

TASK: Analyze this financial data and provide exactly 3 personalized financial advice tips formatted as actionable weekly tasks. Focus on practical actions that could help improve their financial situation based on the actual transaction patterns shown.

IMPORTANT: Please respond with a JSON array of exactly 3 objects. Each object should contain:
- id: a unique number (1, 2, 3)
- text: the advice/task (keep it under 80 characters, actionable and specific)
- completed: false
- points: a number between 15-30 based on impact
- category: one of "spending", "saving", "budgeting", "optimization"

Focus on practical actions like reducing specific spending categories, increasing savings, or optimizing financial habits based on the actual transaction patterns shown. Make sure the advice is relevant to Canadian/American students and young adults.

Example format:
[
  {
    "id": 1,
    "text": "Reduce dining out expenses by cooking 3 more meals at home this week",
    "completed": false,
    "points": 20,
    "category": "spending"
  },
  {
    "id": 2,
    "text": "Set up automatic $50 weekly transfer to savings account",
    "completed": false,
    "points": 25,
    "category": "saving"
  },
  {
    "id": 3,
    "text": "Review and cancel unused subscriptions to save money",
    "completed": false,
    "points": 20,
    "category": "optimization"
  }
]`

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Gemini API Error Response:', errorData)
        throw new Error(`Gemini API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error('No candidates in Gemini response:', data)
        throw new Error('No response generated by Gemini')
      }

      const generatedText = data.candidates[0].content.parts[0].text
      
      // Parse the JSON response
      try {
        // Clean up the response to extract JSON
        let jsonText = generatedText
        
        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\n?/, '').replace(/```\n?/, '')
        
        // Find JSON array in the response
        const jsonMatch = jsonText.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          jsonText = jsonMatch[0]
        }
        
        const advice = JSON.parse(jsonText)
        return Array.isArray(advice) && advice.length === 3 ? advice : []
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError, 'Raw response:', generatedText)
        return []
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      throw error
    }
  }

  // Load weekly advice on component mount or when plaidData changes
  useEffect(() => {
    if (plaidData?.transactions) {
      generateWeeklyAdvice(plaidData.transactions)
    } else {
      // Show message if no Plaid data
      setWeeklyGuidance([{
        week: "This Week",
        tasks: [],
        generatedAt: new Date().toISOString(),
        isAIGenerated: false,
        error: "Connect your bank account to get personalized financial advice",
        noAdvice: true
      }])
    }
  }, [plaidData])

  const goalTypes = [
    { id: 'savings', name: 'Save Money', icon: Target, description: 'Build an emergency fund or save for something special' },
    { id: 'investment', name: 'Start Investing', icon: TrendingUp, description: 'Grow your money for the future' },
    { id: 'credit', name: 'Build Credit', icon: CreditCard, description: 'Improve your credit score' },
    { id: 'education', name: 'Education Fund', icon: GraduationCap, description: 'Save for tuition or courses' }
  ]

  const handleAddGoal = (type) => {
    setSelectedGoalType(type)
    setNewGoalData({
      title: getDefaultTitle(type),
      targetAmount: '',
      deadline: '',
      description: getDefaultDescription(type)
    })
  }

  const getDefaultTitle = (type) => {
    const titles = {
      savings: 'Emergency Fund',
      investment: 'Investment Portfolio',
      credit: 'Credit Building',
      education: 'Education Fund'
    }
    return titles[type] || ''
  }

  const getDefaultDescription = (type) => {
    const descriptions = {
      savings: 'Build a financial safety net',
      investment: 'Grow wealth for the future',
      credit: 'Improve credit score and utilization',
      education: 'Save for courses and learning'
    }
    return descriptions[type] || ''
  }

  const handleCreateGoal = () => {
    if (!newGoalData.title || !newGoalData.targetAmount || !newGoalData.deadline) {
      return
    }

    const newGoal = {
      id: Date.now(),
      title: newGoalData.title,
      description: newGoalData.description,
      progress: 0,
      currentAmount: 0,
      targetAmount: parseFloat(newGoalData.targetAmount),
      deadline: newGoalData.deadline,
      type: selectedGoalType,
      color: getGoalColor(selectedGoalType),
      isActive: true,
      dailyTip: generateDailyTip(selectedGoalType, parseFloat(newGoalData.targetAmount), newGoalData.deadline)
    }

    setActiveGoals(prev => [...prev, newGoal])
    setShowAddGoal(false)
    setSelectedGoalType('')
    setNewGoalData({ title: '', targetAmount: '', deadline: '', description: '' })
  }

  const getGoalColor = (type) => {
    const colors = {
      savings: 'mint',
      investment: 'navy',
      credit: 'beige',
      education: 'purple'
    }
    return colors[type] || 'mint'
  }

  const generateDailyTip = (type, amount, deadline) => {
    const months = deadline.includes('month') ? parseInt(deadline) : 12
    const dailyAmount = Math.ceil(amount / (months * 30))
    
    const tips = {
      savings: `Save $${dailyAmount} daily to reach your goal`,
      investment: `Invest $${dailyAmount} daily for compound growth`,
      credit: `Focus on paying down high-interest debt first`,
      education: `Set aside $${dailyAmount} daily for your learning journey`
    }
    return tips[type] || `Save $${dailyAmount} daily`
  }

  const toggleTask = (taskId) => {
    setWeeklyGuidance(prev => 
      prev.map(week => ({
        ...week,
        tasks: week.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    )
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
    <div className="goals-tab">
      {/* Header */}
      <div className="goals-header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Goals & Coach</h1>
          <p>
            {plaidData 
              ? `Connected to your financial accounts`
              : 'Set up your personalized path to financial success'
            }
          </p>
        </motion.div>

        <motion.button
          className="add-goal-btn"
          onClick={() => setShowAddGoal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Plus size={20} />
          Add Goal
        </motion.button>
      </div>

      {/* Rest of the component remains the same... */}
      <motion.div 
        className="goals-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Active Goals */}
        <motion.div className="goals-section" variants={itemVariants}>
          <h2>Your Goals</h2>
          <p>Track your progress and stay motivated</p>
          {activeGoals.length === 0 ? (
            <div className="empty-state">
              <Target size={48} className="empty-icon" />
              <h3>No goals yet</h3>
              <p>Create your first financial goal to get started</p>
              <button 
                className="create-first-goal-btn"
                onClick={() => setShowAddGoal(true)}
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="goals-grid">
              {activeGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  className={`goal-card active ${goal.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="goal-header">
                    <div className="goal-info">
                      <h3>{goal.title}</h3>
                      <p>{goal.description}</p>
                    </div>
                    <div className="goal-progress-circle">
                      <motion.div
                        className="progress-ring"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: (goal.progress / 100) * 360 }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                      />
                      <span className="progress-text">{Math.round(goal.progress)}%</span>
                    </div>
                  </div>

                  <div className="goal-details">
                    <div className="amount-progress">
                      <div className="amounts">
                        <span className="current">${Math.round(goal.currentAmount)}</span>
                        <span className="target">of ${Math.round(goal.targetAmount)}</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ delay: index * 0.1 + 0.7, duration: 0.8 }}
                        />
                      </div>
                    </div>

                    <div className="goal-meta">
                      <div className="deadline">
                        <Calendar size={16} />
                        <span>{goal.deadline}</span>
                      </div>
                    </div>

                    {goal.dailyTip && (
                      <motion.div 
                        className="daily-guidance"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.9 }}
                      >
                        <Zap size={16} />
                        <span>{goal.dailyTip}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Weekly Guidance */}
        {weeklyGuidance.length > 0 && (
          <motion.div className="guidance-section" variants={itemVariants}>
            <div className="guidance-header-section">
              <div className="guidance-title">
                <h2>Weekly Guidance</h2>
                {weeklyGuidance[0]?.isAIGenerated && (
                  <div className="ai-badge">
                    <Brain size={16} />
                    <span>AI Powered</span>
                  </div>
                )}
              </div>
              <p>
                {weeklyGuidance[0]?.isAIGenerated 
                  ? "Personalized advice based on your recent spending patterns"
                  : "Complete tasks to earn points and improve your financial habits"
                }
              </p>
            </div>
            
            {isLoadingAdvice ? (
              <div className="loading-advice">
                <div className="loading-spinner">
                  <Sparkles size={24} className="spinning" />
                </div>
                <p>Analyzing your transactions to generate personalized advice...</p>
              </div>
            ) : (
              weeklyGuidance.map((week, weekIndex) => (
                <div key={week.week} className="guidance-card">
                  <div className="guidance-header">
                    <h3>{week.week}</h3>
                    <span className="tasks-count">
                      {week.tasks.filter(t => t.completed).length}/{week.tasks.length} completed
                    </span>
                  </div>

                  {week.error && (
                    <div className="error-message">
                      <span>⚠️ {week.error}</span>
                    </div>
                  )}

                  {!week.noAdvice && week.tasks.length > 0 && (
                    <div className="tasks-list">
                      {week.tasks.map((task, taskIndex) => (
                        <motion.div
                          key={task.id}
                          className={`task-item ${task.completed ? 'completed' : ''} ${task.category || ''}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: taskIndex * 0.1 + 0.4 }}
                        >
                          <motion.button
                            className="task-checkbox"
                            onClick={() => toggleTask(task.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {task.completed && <CheckCircle size={16} />}
                          </motion.button>
                          
                          <span className="task-text">{task.text}</span>
                          
                          <div className="task-meta">
                            {task.category && (
                              <span className="task-category">{task.category}</span>
                            )}
                            <div className="task-points">
                              <span>+{task.points} pts</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {week.noAdvice && (
                    <div className="no-advice-message">
                      <Brain size={48} className="no-advice-icon" />
                      <h4>No Advice Available</h4>
                      <p>
                        {week.error.includes('bank account') 
                          ? 'Connect your bank account to receive AI-powered financial insights and personalized weekly tasks.'
                          : 'We\'re unable to generate personalized advice right now. Please try again later or check your connection.'
                        }
                      </p>
                      {week.error.includes('bank account') && (
                        <button className="connect-account-btn">
                          Connect Bank Account
                        </button>
                      )}
                    </div>
                  )}
                  
                  {week.generatedAt && (
                    <div className="advice-footer">
                      <span className="advice-timestamp">
                        Generated {new Date(week.generatedAt).toLocaleDateString()}
                      </span>
                      {week.isAIGenerated && (
                        <button 
                          className="refresh-advice-btn"
                          onClick={() => {
                            // Clear cache and regenerate
                            const currentWeek = getCurrentWeekKey()
                            localStorage.removeItem(`weeklyAdvice_${currentWeek}`)
                            if (plaidData?.transactions) {
                              generateWeeklyAdvice(plaidData.transactions)
                            }
                          }}
                        >
                          <Sparkles size={14} />
                          Refresh Advice
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Add Goal Modal */}
        <AnimatePresence>
          {showAddGoal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddGoal(false)}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                {!selectedGoalType ? (
                  <>
                    <div className="modal-header">
                      <h2>Choose Goal Type</h2>
                      <p>What financial goal would you like to work towards?</p>
                    </div>
                    
                    <div className="goal-types-grid">
                      {goalTypes.map((type) => {
                        const IconComponent = type.icon
                        return (
                          <motion.button
                            key={type.id}
                            className="goal-type-card"
                            onClick={() => handleAddGoal(type.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="goal-type-icon">
                              <IconComponent size={32} />
                            </div>
                            <h3>{type.name}</h3>
                            <p>{type.description}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="modal-header">
                      <h2>Create {goalTypes.find(t => t.id === selectedGoalType)?.name} Goal</h2>
                      <p>Set up your {selectedGoalType} goal with specific targets</p>
                    </div>

                    <div className="goal-form">
                      <div className="form-group">
                        <label htmlFor="title">Goal Title</label>
                        <input
                          id="title"
                          type="text"
                          value={newGoalData.title}
                          onChange={(e) => setNewGoalData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter goal title"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          value={newGoalData.description}
                          onChange={(e) => setNewGoalData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your goal"
                          rows={3}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="amount">Target Amount ($)</label>
                          <input
                            id="amount"
                            type="number"
                            value={newGoalData.targetAmount}
                            onChange={(e) => setNewGoalData(prev => ({ ...prev, targetAmount: e.target.value }))}
                            placeholder="1000"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="deadline">Timeline</label>
                          <select
                            id="deadline"
                            value={newGoalData.deadline}
                            onChange={(e) => setNewGoalData(prev => ({ ...prev, deadline: e.target.value }))}
                          >
                            <option value="">Select timeline</option>
                            <option value="1 month">1 Month</option>
                            <option value="3 months">3 Months</option>
                            <option value="6 months">6 Months</option>
                            <option value="This year">This Year</option>
                            <option value="2 years">2 Years</option>
                          </select>
                        </div>
                      </div>

                      {selectedGoalType === 'savings' && (
                        <div className="goal-specific-info">
                          <div className="info-card">
                            <Target size={20} />
                            <div>
                              <h4>Savings Tip</h4>
                              <p>Start with small, consistent amounts. Even $5 a day adds up to $1,825 per year!</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedGoalType === 'investment' && (
                        <div className="goal-specific-info">
                          <div className="info-card">
                            <TrendingUp size={20} />
                            <div>
                              <h4>Investment Tip</h4>
                              <p>Consider starting with index funds for diversification and lower fees.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedGoalType === 'credit' && (
                        <div className="goal-specific-info">
                          <div className="info-card">
                            <CreditCard size={20} />
                            <div>
                              <h4>Credit Tip</h4>
                              <p>Keep utilization below 30% and make payments on time to improve your score.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedGoalType === 'education' && (
                        <div className="goal-specific-info">
                          <div className="info-card">
                            <GraduationCap size={20} />
                            <div>
                              <h4>Education Tip</h4>
                              <p>Invest in skills that increase your earning potential for long-term benefits.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="modal-actions">
                        <button 
                          className="btn-secondary"
                          onClick={() => setSelectedGoalType('')}
                        >
                          Back
                        </button>
                        <button 
                          className="btn-primary"
                          onClick={handleCreateGoal}
                          disabled={!newGoalData.title || !newGoalData.targetAmount || !newGoalData.deadline}
                        >
                          Create Goal
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest of component (locked goals, modal) remains the same... */}
      </motion.div>
    </div>
  )
}

export default GoalsTab;