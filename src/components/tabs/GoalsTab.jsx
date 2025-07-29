import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, TrendingUp, CreditCard, GraduationCap, Lock, CheckCircle, Calendar, DollarSign, Zap } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'

const GoalsTab = () => {
  const { user, plaidData } = useUser()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [selectedGoalType, setSelectedGoalType] = useState('')

  // Generate personalized goals based on user's financial data
  const generatePersonalizedGoals = () => {
    const goals = []
    
    if (plaidData) {
      const { totalBalance, spendingInsights, accountTypes } = plaidData
      
      // Emergency fund goal based on spending
      if (spendingInsights?.totalSpent) {
        const monthlySpending = spendingInsights.totalSpent
        const emergencyTarget = monthlySpending * 3 // 3 months of expenses
        const currentSavings = accountTypes.savings.reduce((sum, acc) => sum + (acc.balances?.current || 0), 0)
        
        goals.push({
          id: 1,
          title: "Emergency Fund",
          description: `Build ${monthlySpending > 1000 ? 'a robust' : 'an'} emergency fund`,
          progress: Math.min((currentSavings / emergencyTarget) * 100, 100),
          currentAmount: currentSavings,
          targetAmount: emergencyTarget,
          deadline: "6 months",
          type: "savings",
          color: "mint",
          isActive: true,
          dailyTip: `Save $${Math.ceil((emergencyTarget - currentSavings) / 180)} daily to reach your goal`
        })
      }

      // Investment goal if they have sufficient emergency fund
      const hasEmergencyFund = accountTypes.savings.reduce((sum, acc) => sum + (acc.balances?.current || 0), 0) > 1000
      if (hasEmergencyFund && totalBalance > 2000) {
        goals.push({
          id: 2,
          title: "Investment Portfolio",
          description: "Start building long-term wealth",
          progress: accountTypes.investment.length > 0 ? 25 : 0,
          currentAmount: accountTypes.investment.reduce((sum, acc) => sum + (acc.balances?.current || 0), 0),
          targetAmount: 5000,
          deadline: "This year",
          type: "investment",
          color: "navy",
          isActive: true,
          dailyTip: "Consider starting with index funds for diversification"
        })
      }

      // Credit building goal if they have credit cards
      if (accountTypes.credit.length > 0) {
        const totalCreditUsed = accountTypes.credit.reduce((sum, acc) => sum + (acc.balances?.current || 0), 0)
        const totalCreditLimit = accountTypes.credit.reduce((sum, acc) => sum + (acc.balances?.limit || 0), 0)
        const utilizationRate = (totalCreditUsed / totalCreditLimit) * 100

        if (utilizationRate > 30) {
          goals.push({
            id: 3,
            title: "Credit Optimization",
            description: "Improve credit utilization ratio",
            progress: Math.max(0, 100 - utilizationRate),
            currentAmount: totalCreditLimit - totalCreditUsed,
            targetAmount: totalCreditLimit * 0.7, // Target 30% utilization
            deadline: "3 months",
            type: "credit",
            color: "beige",
            isActive: true,
            dailyTip: `Pay down $${Math.ceil((totalCreditUsed - (totalCreditLimit * 0.3)) / 90)} daily to improve credit score`
          })
        }
      }
    }

    // Default goals if no Plaid data
    if (goals.length === 0) {
      goals.push(
        {
          id: 1,
          title: "Emergency Fund",
          description: "Build a $1,000 safety net",
          progress: 0,
          currentAmount: 0,
          targetAmount: 1000,
          deadline: "4 months",
          type: "savings",
          color: "mint",
          isActive: true,
          dailyTip: "Start by saving $8.50 per day"
        },
        {
          id: 2,
          title: "Investment Journey",
          description: "Begin investing for your future",
          progress: 0,
          currentAmount: 0,
          targetAmount: 500,
          deadline: "6 months",
          type: "investment",
          color: "navy",
          isActive: true,
          dailyTip: "Research beginner-friendly investment apps"
        }
      )
    }

    return goals
  }

  const [activeGoals, setActiveGoals] = useState([])
  const [weeklyGuidance, setWeeklyGuidance] = useState([])

  useEffect(() => {
    setActiveGoals(generatePersonalizedGoals())
    setWeeklyGuidance([{
      week: "This Week",
      tasks: generateWeeklyTasks()
    }])
  }, [plaidData])

  // Generate personalized weekly tasks based on user data
  const generateWeeklyTasks = () => {
    const tasks = []
    
    if (plaidData?.spendingInsights) {
      const { topCategories, totalSpent } = plaidData.spendingInsights
      
      // Task based on top spending category
      if (topCategories?.length > 0) {
        const topCategory = topCategories[0]
        tasks.push({
          id: 1,
          text: `Review ${topCategory.category.toLowerCase()} spending (${topCategory.percentage}% of budget)`,
          completed: false,
          points: 15
        })
      }

      // Spending tracking task
      if (totalSpent > 0) {
        tasks.push({
          id: 2,
          text: `You spent $${totalSpent.toFixed(0)} last month - track this week's expenses`,
          completed: false,
          points: 20
        })
      }
    }

    // Default tasks
    tasks.push(
      {
        id: 3,
        text: "Set up automatic savings transfer",
        completed: false,
        points: 25
      },
      {
        id: 4,
        text: "Review and categorize recent transactions",
        completed: false,
        points: 15
      }
    )

    return tasks.slice(0, 4) // Limit to 4 tasks
  }

  // Rest of your component remains the same...
  const lockedGoals = [
    {
      id: 101,
      title: "Advanced Credit Strategy",
      description: "Optimize credit mix and timing",
      type: "credit",
      color: "beige",
      isLocked: true,
      requiresPremium: true
    },
    {
      id: 102,
      title: "Tax Optimization",
      description: "Maximize deductions and credits",
      type: "tax",
      color: "navy",
      isLocked: true,
      requiresPremium: true
    }
  ]

  const goalTypes = [
    { id: 'savings', name: 'Save Money', icon: Target, description: 'Build an emergency fund or save for something special' },
    { id: 'investment', name: 'Start Investing', icon: TrendingUp, description: 'Grow your money for the future' },
    { id: 'credit', name: 'Build Credit', icon: CreditCard, description: 'Improve your credit score' },
    { id: 'education', name: 'Education Fund', icon: GraduationCap, description: 'Save for tuition or courses' }
  ]

  const handleAddGoal = (type) => {
    setSelectedGoalType(type)
    console.log('Adding goal of type:', type)
    setShowAddGoal(false)
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
              ? `Personalized goals based on your $${plaidData.totalBalance?.toFixed(0) || 0} portfolio`
              : 'Your personalized path to financial success'
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

      {/* Financial Overview */}
      {plaidData && (
        <motion.div 
          className="financial-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="overview-cards">
            <div className="overview-card">
              <h4>Total Balance</h4>
              <span className="amount">${plaidData.totalBalance?.toFixed(0) || 0}</span>
            </div>
            <div className="overview-card">
              <h4>Monthly Spending</h4>
              <span className="amount">${plaidData.spendingInsights?.totalSpent?.toFixed(0) || 0}</span>
            </div>
            <div className="overview-card">
              <h4>Accounts Connected</h4>
              <span className="amount">{plaidData.accounts?.length || 0}</span>
            </div>
          </div>
        </motion.div>
      )}

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
        </motion.div>

        {/* Weekly Guidance */}
        <motion.div className="guidance-section" variants={itemVariants}>
          <h2>Weekly Guidance</h2>
          {weeklyGuidance.map((week, weekIndex) => (
            <div key={week.week} className="guidance-card">
              <div className="guidance-header">
                <h3>{week.week}</h3>
                <span className="tasks-count">
                  {week.tasks.filter(t => t.completed).length}/{week.tasks.length} completed
                </span>
              </div>
              
              <div className="tasks-list">
                {week.tasks.map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    className={`task-item ${task.completed ? 'completed' : ''}`}
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
                    
                    <div className="task-points">
                      <span>+{task.points} pts</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Rest of component (locked goals, modal) remains the same... */}
      </motion.div>
    </div>
  )
}

export default GoalsTab