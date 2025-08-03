import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, BarChart3, Target, Gift, Settings } from 'lucide-react'

// Import tab components
import ChatTab from './tabs/ChatTab'
import InsightsTab from './tabs/InsightsTab'
import GoalsTab from './tabs/GoalsTab'
import OffersTab from './tabs/OffersTab'
import SettingsTab from './tabs/SettingsTab'

// Import logo
import logoImage from '../assets/logo.png'

const MainApp = ({ user }) => {
  const [activeTab, setActiveTab] = useState('chat')

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, component: ChatTab },
    { id: 'insights', label: 'Insights', icon: BarChart3, component: InsightsTab },
    { id: 'goals', label: 'Goals', icon: Target, component: GoalsTab },
    { id: 'offers', label: 'Offers', icon: Gift, component: OffersTab },
    { id: 'settings', label: 'Settings', icon: Settings, component: SettingsTab }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="main-app">
      <div className="main-content">
        {/* App Logo - moved inside main-content */}
        <div className="app-logo-header">
          <motion.img
            src={logoImage}
            alt="AskCents Logo"
            className="main-app-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {ActiveComponent && <ActiveComponent user={user} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="mobile-nav">
        <div className="nav-container">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.9 }}
            >
              <tab.icon className="nav-icon" />
              <span className="nav-label">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default MainApp
