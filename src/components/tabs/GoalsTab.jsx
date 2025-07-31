import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, TrendingUp, CreditCard, GraduationCap, Lock, CheckCircle, Calendar, DollarSign, Zap } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'

const GoalsTab = () => {
  const { user, plaidData } = useUser()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [selectedGoalType, setSelectedGoalType] = useState('')
  const [activeGoals, setActiveGoals] = useState([])
  const [weeklyGuidance, setWeeklyGuidance] = useState([])
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    description: ''
  })

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
        {activeGoals.length > 0 && (
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