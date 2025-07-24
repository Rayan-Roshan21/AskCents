import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, TrendingUp, CreditCard, GraduationCap, Lock, CheckCircle, Calendar, DollarSign, Zap } from 'lucide-react'

const GoalsTab = ({ user }) => {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [selectedGoalType, setSelectedGoalType] = useState('')

  const activeGoals = [
    {
      id: 1,
      title: "Emergency Fund",
      description: "Build a $1,000 safety net",
      progress: 65,
      currentAmount: 650,
      targetAmount: 1000,
      deadline: "3 months",
      type: "savings",
      color: "mint",
      isActive: true,
      dailyTip: "Save $12 today by skipping one delivery order"
    },
    {
      id: 2,
      title: "Investment Portfolio",
      description: "Start investing $50/month",
      progress: 40,
      currentAmount: 200,
      targetAmount: 500,
      deadline: "This year",
      type: "investment",
      color: "navy",
      isActive: true,
      dailyTip: "Set up automatic transfers on payday"
    }
  ]

  const lockedGoals = [
    {
      id: 3,
      title: "Credit Builder",
      description: "Improve credit score to 750+",
      type: "credit",
      color: "beige",
      isLocked: true,
      requiresPremium: true
    },
    {
      id: 4,
      title: "Student Loan Strategy",
      description: "Optimize loan repayment plan",
      type: "debt",
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

  const weeklyGuidance = [
    {
      week: "This Week",
      tasks: [
        { id: 1, text: "Transfer $15 to emergency fund", completed: true, points: 10 },
        { id: 2, text: "Track all spending for 3 days", completed: true, points: 15 },
        { id: 3, text: "Research high-yield savings accounts", completed: false, points: 20 },
        { id: 4, text: "Set up investment account", completed: false, points: 25 }
      ]
    }
  ]

  const handleAddGoal = (type) => {
    setSelectedGoalType(type)
    // In real app, this would open a detailed goal setup flow
    console.log('Adding goal of type:', type)
    setShowAddGoal(false)
  }

  const toggleTask = (taskId) => {
    // In real app, this would update the task completion status
    console.log('Toggling task:', taskId)
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
          <p>Your personalized path to financial success</p>
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

      <motion.div 
        className="goals-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Active Goals */}
        <motion.div className="goals-section" variants={itemVariants}>
          <h2>Active Goals</h2>
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
                    <span className="progress-text">{goal.progress}%</span>
                  </div>
                </div>

                <div className="goal-details">
                  <div className="amount-progress">
                    <div className="amounts">
                      <span className="current">${goal.currentAmount}</span>
                      <span className="target">of ${goal.targetAmount}</span>
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

        {/* Locked Goals */}
        <motion.div className="locked-goals-section" variants={itemVariants}>
          <h2>More Goals Available</h2>
          <div className="locked-goals-grid">
            {lockedGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                className="goal-card locked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="lock-overlay">
                  <Lock size={24} />
                </div>
                <div className="goal-content">
                  <h3>{goal.title}</h3>
                  <p>{goal.description}</p>
                  {goal.requiresPremium && (
                    <span className="premium-badge">Premium</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button 
            className="unlock-premium-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Unlock Premium Goals
          </motion.button>
        </motion.div>
      </motion.div>

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
              className="add-goal-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Choose a Goal Type</h3>
                <p>What would you like to work towards?</p>
              </div>
              
              <div className="goal-types-grid">
                {goalTypes.map((type, index) => (
                  <motion.button
                    key={type.id}
                    className="goal-type-card"
                    onClick={() => handleAddGoal(type.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <type.icon size={32} />
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GoalsTab
