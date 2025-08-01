import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, TrendingUp, CreditCard, Users, ExternalLink, Star, Shield, ChevronRight, Coins, Target, Calendar, CheckCircle, Lock } from 'lucide-react'

const OffersTab = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState('points')
  const [userPoints, setUserPoints] = useState(0)
  const [completedTasks, setCompletedTasks] = useState([])
  
  // Load user points from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem('askCentsPoints')
    const savedTasks = localStorage.getItem('askCentsCompletedTasks')
    
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints, 10))
    }
    
    if (savedTasks) {
      setCompletedTasks(JSON.parse(savedTasks))
    }
  }, [])
  
  // Save points when they change
  useEffect(() => {
    localStorage.setItem('askCentsPoints', userPoints.toString())
  }, [userPoints])
  
  // Save completed tasks when they change
  useEffect(() => {
    localStorage.setItem('askCentsCompletedTasks', JSON.stringify(completedTasks))
  }, [completedTasks])

  const categories = [
    { id: 'points', name: 'Points & Rewards', icon: Coins },
    { id: 'earn', name: 'Earn Points', icon: Target },
    { id: 'redeem', name: 'Redeem', icon: Gift },
  ]

  // Ways to earn points
  const earningOpportunities = [
    {
      id: 'referral',
      title: 'Refer a Friend',
      description: 'Invite friends to join AskCents',
      points: 500,
      action: 'Share referral link',
      repeatable: true,
      icon: Users,
      color: 'mint'
    },
    {
      id: 'weekly_task',
      title: 'Complete Weekly Tasks',
      description: 'Finish your weekly financial goals',
      points: 100,
      action: 'View tasks',
      repeatable: true,
      icon: Calendar,
      color: 'navy'
    },
    {
      id: 'chat_milestone',
      title: 'Chat Milestone',
      description: 'Ask 10 questions in the chat',
      points: 150,
      action: 'Start chatting',
      repeatable: false,
      icon: TrendingUp,
      color: 'beige'
    },
    {
      id: 'profile_complete',
      title: 'Complete Profile',
      description: 'Fill out your complete financial profile',
      points: 200,
      action: 'Complete profile',
      repeatable: false,
      icon: CheckCircle,
      color: 'mint'
    }
  ]

  // Redemption options
  const redemptionOptions = [
    {
      id: 'premium_week',
      title: '1 Week Premium Access',
      description: 'Unlock advanced AI features and insights',
      cost: 300,
      features: ['Advanced AI coaching', 'Detailed analytics', 'Priority support'],
      available: true,
      icon: Star,
      color: 'mint'
    },
    {
      id: 'premium_month',
      title: '1 Month Premium Access',
      description: 'Full premium experience for a month',
      cost: 1000,
      features: ['All premium features', 'Personalized reports', 'Goal tracking+'],
      available: true,
      icon: TrendingUp,
      color: 'navy'
    },
    {
      id: 'financial_consultation',
      title: 'Free Financial Consultation',
      description: '30-min session with a certified advisor',
      cost: 2000,
      features: ['Certified financial advisor', '30-minute session', 'Personalized advice'],
      available: userPoints >= 2000,
      icon: Users,
      color: 'beige'
    },
    {
      id: 'exclusive_content',
      title: 'Exclusive Financial Course',
      description: 'Access to premium educational content',
      cost: 1500,
      features: ['Video tutorials', 'Worksheets', 'Certificate'],
      available: true,
      icon: Shield,
      color: 'mint'
    }
  ]
  const handleEarnPoints = (opportunity) => {
    if (opportunity.id === 'referral') {
      // Handle referral action
      setUserPoints(prev => prev + opportunity.points)
      // In a real app, you'd generate and share a referral link
      alert(`Referral link copied! You'll earn ${opportunity.points} points when your friend signs up.`)
    } else if (!completedTasks.includes(opportunity.id)) {
      setUserPoints(prev => prev + opportunity.points)
      setCompletedTasks(prev => [...prev, opportunity.id])
      alert(`Congratulations! You earned ${opportunity.points} points!`)
    }
  }

  const handleRedeem = (option) => {
    if (userPoints >= option.cost) {
      setUserPoints(prev => prev - option.cost)
      alert(`Successfully redeemed: ${option.title}!`)
      // In a real app, you'd handle the actual redemption logic
    } else {
      alert(`You need ${option.cost - userPoints} more points to redeem this item.`)
    }
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
    <div className="offers-tab">
      {/* Header */}
      <div className="offers-header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Rewards Center</h1>
          <p>Earn points, unlock premium features, and get exclusive offers</p>
        </motion.div>
      </div>

      {/* Points Display - Moved to separate section */}
      <motion.div 
        className="points-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="points-container">
          <Coins className="points-icon" />
          <div className="points-info">
            <span className="points-amount">{userPoints.toLocaleString()}</span>
            <span className="points-label">Available Points</span>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div 
        className="category-selector"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <category.icon size={18} />
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      <motion.div 
        className="offers-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Points Overview */}
        {activeCategory === 'points' && (
          <motion.div className="points-overview" variants={itemVariants}>
            <div className="points-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Coins size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{userPoints.toLocaleString()}</span>
                  <span className="stat-label">Total Points</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Target size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{completedTasks.length}</span>
                  <span className="stat-label">Tasks Completed</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Gift size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{redemptionOptions.filter(option => userPoints >= option.cost).length}</span>
                  <span className="stat-label">Available Rewards</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <motion.button 
                  className="action-btn earn"
                  onClick={() => setActiveCategory('earn')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target size={20} />
                  Earn More Points
                </motion.button>
                
                <motion.button 
                  className="action-btn redeem"
                  onClick={() => setActiveCategory('redeem')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Gift size={20} />
                  Redeem Rewards
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Earn Points Section */}
        {activeCategory === 'earn' && (
          <motion.div className="earn-section" variants={itemVariants}>
            <h2>Ways to Earn Points</h2>
            <div className="earning-grid">
              {earningOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  className={`earning-card ${opportunity.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="earning-header">
                    <div className="earning-icon">
                      <opportunity.icon size={24} />
                    </div>
                    <div className="points-badge">
                      +{opportunity.points} pts
                    </div>
                  </div>
                  
                  <div className="earning-content">
                    <h3>{opportunity.title}</h3>
                    <p>{opportunity.description}</p>
                    
                    {completedTasks.includes(opportunity.id) && !opportunity.repeatable && (
                      <div className="completed-badge">
                        <CheckCircle size={16} />
                        Completed
                      </div>
                    )}
                  </div>
                  
                  <motion.button 
                    className={`earning-btn ${completedTasks.includes(opportunity.id) && !opportunity.repeatable ? 'completed' : ''}`}
                    onClick={() => handleEarnPoints(opportunity)}
                    disabled={completedTasks.includes(opportunity.id) && !opportunity.repeatable}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {completedTasks.includes(opportunity.id) && !opportunity.repeatable ? 'Completed' : opportunity.action}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Redeem Section */}
        {activeCategory === 'redeem' && (
          <motion.div className="redeem-section" variants={itemVariants}>
            <h2>Redeem Your Points</h2>
            <div className="redemption-grid">
              {redemptionOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  className={`redemption-card ${option.color} ${userPoints >= option.cost ? 'available' : 'locked'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="redemption-header">
                    <div className="redemption-icon">
                      {userPoints >= option.cost ? (
                        <option.icon size={24} />
                      ) : (
                        <Lock size={24} />
                      )}
                    </div>
                    <div className="cost-badge">
                      {option.cost} pts
                    </div>
                  </div>
                  
                  <div className="redemption-content">
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                    
                    <div className="features-list">
                      {option.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button 
                    className={`redemption-btn ${userPoints >= option.cost ? 'available' : 'locked'}`}
                    onClick={() => handleRedeem(option)}
                    disabled={userPoints < option.cost}
                    whileHover={userPoints >= option.cost ? { scale: 1.05 } : {}}
                    whileTap={userPoints >= option.cost ? { scale: 0.95 } : {}}
                  >
                    {userPoints >= option.cost ? 'Redeem' : `Need ${option.cost - userPoints} more points`}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OffersTab;
