import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, Bell, CreditCard, HelpCircle, MessageSquare, LogOut, ChevronRight, Eye, EyeOff, Check } from 'lucide-react'

const SettingsTab = ({ user }) => {
  const [anonymousMode, setAnonymousMode] = useState(false)
  const [notifications, setNotifications] = useState({
    tips: true,
    goals: true,
    spending: false,
    offers: true
  })

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: User,
          title: 'Profile Settings',
          subtitle: 'Email, name, and preferences',
          action: 'view'
        },
        {
          id: 'privacy',
          icon: Shield,
          title: 'Privacy & Data',
          subtitle: 'Control how your data is used',
          action: 'view'
        },
        {
          id: 'anonymous',
          icon: anonymousMode ? EyeOff : Eye,
          title: 'Anonymous Mode',
          subtitle: anonymousMode ? 'Currently anonymous' : 'Share data for better insights',
          action: 'toggle',
          value: anonymousMode,
          onChange: setAnonymousMode
        }
      ]
    },
    {
      title: 'Goals & Coaching',
      items: [
        {
          id: 'goals',
          icon: User,
          title: 'Manage Goals',
          subtitle: 'Edit or remove your financial goals',
          action: 'view'
        },
        {
          id: 'coaching',
          icon: MessageSquare,
          title: 'Coaching Preferences',
          subtitle: 'Customize your AI coach style',
          action: 'view'
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'tips',
          icon: Bell,
          title: 'Daily Tips',
          subtitle: 'Get personalized financial tips',
          action: 'toggle',
          value: notifications.tips,
          onChange: (value) => setNotifications(prev => ({...prev, tips: value}))
        },
        {
          id: 'goals',
          icon: Bell,
          title: 'Goal Updates',
          subtitle: 'Progress and milestone notifications',
          action: 'toggle',
          value: notifications.goals,
          onChange: (value) => setNotifications(prev => ({...prev, goals: value}))
        },
        {
          id: 'spending',
          icon: Bell,
          title: 'Spending Alerts',
          subtitle: 'Unusual spending notifications',
          action: 'toggle',
          value: notifications.spending,
          onChange: (value) => setNotifications(prev => ({...prev, spending: value}))
        },
        {
          id: 'offers',
          icon: Bell,
          title: 'New Offers',
          subtitle: 'Student deals and partnerships',
          action: 'toggle',
          value: notifications.offers,
          onChange: (value) => setNotifications(prev => ({...prev, offers: value}))
        }
      ]
    },
    {
      title: 'Subscription',
      items: [
        {
          id: 'subscription',
          icon: CreditCard,
          title: 'Premium Subscription',
          subtitle: 'Currently on free plan',
          action: 'view',
          highlight: true
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: HelpCircle,
          title: 'Help Center',
          subtitle: 'FAQs and tutorials',
          action: 'view'
        },
        {
          id: 'feedback',
          icon: MessageSquare,
          title: 'Send Feedback',
          subtitle: 'Report issues or suggest features',
          action: 'view'
        }
      ]
    }
  ]

  const handleItemClick = (item) => {
    if (item.action === 'toggle' && item.onChange) {
      item.onChange(!item.value)
    } else {
      // Handle navigation to other screens
      console.log('Navigate to:', item.id)
    }
  }

  const handleLogout = () => {
    console.log('Logout user')
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
    <div className="settings-tab">
      {/* Header */}
      <div className="settings-header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </motion.div>
      </div>

      <motion.div 
        className="settings-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* User Profile Card */}
        <motion.div className="profile-card" variants={itemVariants}>
          <div className="profile-info">
            <div className="profile-avatar">
              <span>{user.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="profile-details">
              <h3>{user.name || 'User'}</h3>
              <p>{user.email}</p>
              <span className="plan-badge">Free Plan</span>
            </div>
          </div>
          <motion.button 
            className="edit-profile-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div 
            key={section.title}
            className="settings-section"
            variants={itemVariants}
          >
            <h2 className="section-title">{section.title}</h2>
            <div className="settings-items">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  className={`settings-item ${item.highlight ? 'highlight' : ''}`}
                  onClick={() => handleItemClick(item)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: itemIndex * 0.05 + sectionIndex * 0.1 }}
                >
                  <div className="item-content">
                    <div className="item-icon">
                      <item.icon size={20} />
                    </div>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="item-action">
                    {item.action === 'toggle' ? (
                      <motion.div
                        className={`toggle-switch ${item.value ? 'active' : ''}`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div
                          className="toggle-knob"
                          animate={{ x: item.value ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                        {item.value && <Check size={12} className="toggle-check" />}
                      </motion.div>
                    ) : (
                      <ChevronRight size={20} className="chevron" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Premium Upgrade CTA */}
        <motion.div className="premium-cta" variants={itemVariants}>
          <div className="premium-content">
            <div className="premium-icon">
              <CreditCard size={24} />
            </div>
            <div className="premium-text">
              <h3>Upgrade to Premium</h3>
              <p>Unlock advanced insights, unlimited goals, and priority support</p>
              <ul className="premium-features">
                <li>Advanced spending analytics</li>
                <li>Unlimited goal tracking</li>
                <li>Priority AI coaching</li>
                <li>Export financial reports</li>
              </ul>
            </div>
          </div>
          <motion.button 
            className="premium-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upgrade Now
          </motion.button>
        </motion.div>

        {/* App Info */}
        <motion.div className="app-info" variants={itemVariants}>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data Updated</span>
              <span className="info-value">Just now</span>
            </div>
            <div className="info-item">
              <span className="info-label">Privacy Policy</span>
              <motion.button 
                className="info-link"
                whileHover={{ scale: 1.05 }}
              >
                View
              </motion.button>
            </div>
            <div className="info-item">
              <span className="info-label">Terms of Service</span>
              <motion.button 
                className="info-link"
                whileHover={{ scale: 1.05 }}
              >
                View
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div className="logout-section" variants={itemVariants}>
          <motion.button 
            className="logout-btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            Sign Out
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SettingsTab
