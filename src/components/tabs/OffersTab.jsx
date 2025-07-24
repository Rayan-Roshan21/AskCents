import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, TrendingUp, CreditCard, Users, ExternalLink, Star, Shield, ChevronRight } from 'lucide-react'

const OffersTab = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Offers', icon: Gift },
    { id: 'investing', name: 'Investing', icon: TrendingUp },
    { id: 'banking', name: 'Banking', icon: CreditCard },
    { id: 'referrals', name: 'Referrals', icon: Users }
  ]

  const offers = [
    {
      id: 1,
      category: 'investing',
      title: 'Start investing with Wealthsimple',
      description: 'Get $10 bonus when you invest your first $100',
      bonus: '$10 bonus',
      provider: 'Wealthsimple',
      rating: 4.8,
      reviews: 12500,
      features: ['No minimum balance', 'Automated investing', 'TFSA & RRSP'],
      ctaText: 'Get $10 bonus',
      isPartner: true,
      isFeatured: true,
      color: 'mint'
    },
    {
      id: 2,
      category: 'banking',
      title: 'No-fee student banking',
      description: 'Free chequing account with unlimited transactions',
      bonus: 'No monthly fees',
      provider: 'Tangerine',
      rating: 4.6,
      reviews: 8900,
      features: ['No monthly fees', 'Free e-transfers', 'High interest savings'],
      ctaText: 'Open account',
      isPartner: true,
      isFeatured: false,
      color: 'navy'
    },
    {
      id: 3,
      category: 'banking',
      title: 'Free credit score monitoring',
      description: 'Check your credit score monthly at no cost',
      bonus: 'Always free',
      provider: 'Credit Karma',
      rating: 4.7,
      reviews: 15600,
      features: ['Monthly updates', 'Credit monitoring', 'Improvement tips'],
      ctaText: 'Check score',
      isPartner: false,
      isFeatured: false,
      color: 'beige'
    },
    {
      id: 4,
      category: 'referrals',
      title: 'Refer friends to AskCents',
      description: 'You and your friend both get premium access',
      bonus: '1 month free',
      provider: 'AskCents',
      rating: null,
      reviews: null,
      features: ['Premium AI coaching', 'Advanced insights', 'Goal tracking'],
      ctaText: 'Invite friends',
      isPartner: false,
      isFeatured: true,
      color: 'mint'
    }
  ]

  const filteredOffers = activeCategory === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === activeCategory)

  const featuredOffers = offers.filter(offer => offer.isFeatured)

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
          <h1>Student Offers</h1>
          <p>Curated deals and partnerships for students</p>
        </motion.div>
      </div>

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
        {/* Featured Offers */}
        {activeCategory === 'all' && featuredOffers.length > 0 && (
          <motion.div className="featured-section" variants={itemVariants}>
            <h2>Featured for You</h2>
            <div className="featured-offers">
              {featuredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  className={`featured-offer-card ${offer.color}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="featured-badge">
                    <Star size={16} />
                    Featured
                  </div>
                  
                  <div className="offer-content">
                    <div className="offer-header">
                      <h3>{offer.title}</h3>
                      <span className="bonus-badge">{offer.bonus}</span>
                    </div>
                    
                    <p className="offer-description">{offer.description}</p>
                    
                    <div className="offer-provider">
                      <span className="provider-name">{offer.provider}</span>
                      {offer.isPartner && (
                        <span className="partner-badge">
                          <Shield size={12} />
                          Trusted Partner
                        </span>
                      )}
                    </div>
                    
                    <motion.button 
                      className="offer-cta"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {offer.ctaText}
                      <ExternalLink size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Offers */}
        <motion.div className="offers-section" variants={itemVariants}>
          <h2>
            {activeCategory === 'all' ? 'All Offers' : categories.find(c => c.id === activeCategory)?.name}
          </h2>
          
          <div className="offers-grid">
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                className="offer-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="offer-header">
                  <div className="offer-info">
                    <h3>{offer.title}</h3>
                    <p>{offer.description}</p>
                  </div>
                  <div className="offer-bonus">
                    <span className="bonus-text">{offer.bonus}</span>
                  </div>
                </div>

                <div className="offer-details">
                  <div className="provider-info">
                    <span className="provider-name">{offer.provider}</span>
                    {offer.rating && (
                      <div className="rating">
                        <Star size={14} className="star-filled" />
                        <span>{offer.rating}</span>
                        <span className="reviews">({offer.reviews?.toLocaleString()})</span>
                      </div>
                    )}
                  </div>

                  <div className="offer-features">
                    {offer.features.map((feature, featureIndex) => (
                      <span key={featureIndex} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="offer-footer">
                    {offer.isPartner && (
                      <span className="partner-indicator">
                        <Shield size={14} />
                        Trusted Partner
                      </span>
                    )}
                    
                    <motion.button 
                      className="offer-action"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {offer.ctaText}
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Safety Notice */}
        <motion.div className="safety-notice" variants={itemVariants}>
          <div className="safety-content">
            <Shield className="safety-icon" />
            <div className="safety-text">
              <h3>Your safety matters</h3>
              <p>
                All partners are vetted for student safety. We only recommend legitimate, 
                regulated financial services. Always read terms before signing up.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Referral Section */}
        {activeCategory === 'all' || activeCategory === 'referrals' && (
          <motion.div className="referral-section" variants={itemVariants}>
            <div className="referral-card">
              <div className="referral-content">
                <div className="referral-icon">
                  <Users size={32} />
                </div>
                <div className="referral-text">
                  <h3>Earn premium access</h3>
                  <p>Refer friends and get free premium features for both of you</p>
                </div>
                <motion.button 
                  className="referral-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share AskCents
                </motion.button>
              </div>
              
              <div className="referral-stats">
                <div className="stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Friends referred</span>
                </div>
                <div className="stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Premium days earned</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default OffersTab
