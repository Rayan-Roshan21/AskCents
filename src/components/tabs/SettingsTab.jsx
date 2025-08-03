import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, Bell, CreditCard, HelpCircle, MessageSquare, LogOut, ChevronRight, Eye, EyeOff, Check, X, Save, Download, Trash2, Moon, Sun, Edit3 } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'

const SettingsTab = ({ user }) => {
  const { clearUserData, updateUser } = useUser()
  const [anonymousMode, setAnonymousMode] = useState(() => {
    return localStorage.getItem('askCentsAnonymousMode') === 'true'
  })
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('askCentsNotifications')
    return saved ? JSON.parse(saved) : {
      tips: true,
      goals: true,
      spending: false,
      offers: true,
      weekly: true,
      security: true
    }
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNotificationsModal, setShowNotificationsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [editProfile, setEditProfile] = useState({
    name: user.name || '',
    email: user.email || ''
  })

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('askCentsAnonymousMode', anonymousMode.toString())
  }, [anonymousMode])

  useEffect(() => {
    localStorage.setItem('askCentsNotifications', JSON.stringify(notifications))
  }, [notifications])

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveProfile = () => {
    updateUser(editProfile)
    setShowProfileModal(false)
  }

  const handleExportData = () => {
    const userData = {
      profile: user,
      settings: {
        notifications,
        anonymousMode,
        darkMode
      },
      points: localStorage.getItem('askCentsPoints'),
      completedTasks: localStorage.getItem('askCentsCompletedTasks'),
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'askcents-data-export.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Clear all user data
      localStorage.clear()
      clearUserData()
      alert('Your account has been deleted.')
    }
  }

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: User,
          title: 'Profile Settings',
          subtitle: 'Email, name, and preferences',
          action: 'view',
          onClick: () => setShowProfileModal(true)
        },
        {
          id: 'notifications',
          icon: Bell,
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          action: 'view',
          onClick: () => setShowNotificationsModal(true)
        },
        {
          id: 'privacy',
          icon: Shield,
          title: 'Privacy & Data',
          subtitle: 'Control how your data is used',
          action: 'view',
          onClick: () => setShowPrivacyModal(true)
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
          action: 'view',
          onClick: () => alert('Goal management coming soon!')
        },
        {
          id: 'coaching',
          icon: MessageSquare,
          title: 'Coaching Preferences',
          subtitle: 'Customize your AI coach style',
          action: 'view',
          onClick: () => alert('Coaching preferences coming soon!')
        }
      ]
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          id: 'export',
          icon: Download,
          title: 'Export Data',
          subtitle: 'Download your personal data',
          action: 'view',
          onClick: handleExportData
        },
        {
          id: 'delete',
          icon: Trash2,
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          action: 'view',
          onClick: handleDeleteAccount,
          danger: true
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
          action: 'view',
          onClick: () => window.open('https://help.askcents.com', '_blank')
        },
        {
          id: 'feedback',
          icon: MessageSquare,
          title: 'Send Feedback',
          subtitle: 'Report issues or suggest features',
          action: 'view',
          onClick: () => window.open('mailto:feedback@askcents.com?subject=AskCents Feedback', '_blank')
        }
      ]
    }
  ]

  const handleItemClick = (item) => {
    if (item.action === 'toggle' && item.onChange) {
      item.onChange(!item.value)
    } else if (item.onClick) {
      item.onClick()
    } else {
      // Handle navigation to other screens
      // Navigation logic would go here
    }
  }

  const handleLogout = () => {
    // Clear user data and return to login screen
    clearUserData()
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
            onClick={() => setShowProfileModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 size={16} />
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
                  className={`settings-item ${item.highlight ? 'highlight' : ''} ${item.danger ? 'danger' : ''}`}
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

      {/* Modals */}
      <AnimatePresence>
        {/* Profile Edit Modal */}
        {showProfileModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <button onClick={() => setShowProfileModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editProfile.email}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveProfile}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Notifications Modal */}
        {showNotificationsModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotificationsModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Notification Settings</h3>
                <button onClick={() => setShowNotificationsModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="notification-options">
                  {Object.entries({
                    tips: 'Financial Tips',
                    goals: 'Goal Updates',
                    spending: 'Spending Alerts',
                    offers: 'Offers & Rewards',
                    weekly: 'Weekly Reports',
                    security: 'Security Alerts'
                  }).map(([key, label]) => (
                    <div key={key} className="notification-item">
                      <div className="notification-info">
                        <h4>{label}</h4>
                        <p>Receive notifications about {label.toLowerCase()}</p>
                      </div>
                      <motion.div
                        className={`toggle-switch ${notifications[key] ? 'active' : ''}`}
                        onClick={() => handleNotificationChange(key, !notifications[key])}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div
                          className="toggle-knob"
                          animate={{ x: notifications[key] ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                        {notifications[key] && <Check size={12} className="toggle-check" />}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowNotificationsModal(false)}>
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Privacy Modal */}
        {showPrivacyModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Privacy & Data Settings</h3>
                <button onClick={() => setShowPrivacyModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="privacy-options">
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <div className="privacy-icon">
                        {anonymousMode ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                      <div>
                        <h4>Anonymous Mode</h4>
                        <p>Hide your personal data when sharing insights</p>
                      </div>
                    </div>
                    <motion.div
                      className={`toggle-switch ${anonymousMode ? 'active' : ''}`}
                      onClick={() => setAnonymousMode(!anonymousMode)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        className="toggle-knob"
                        animate={{ x: anonymousMode ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                      {anonymousMode && <Check size={12} className="toggle-check" />}
                    </motion.div>
                  </div>
                  
                  <div className="privacy-actions">
                    <h4>Data Management</h4>
                    <div className="action-buttons">
                      <button className="btn-secondary" onClick={handleExportData}>
                        <Download size={16} />
                        Export My Data
                      </button>
                      <button className="btn-danger" onClick={handleDeleteAccount}>
                        <Trash2 size={16} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowPrivacyModal(false)}>
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SettingsTab
