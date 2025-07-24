import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, Link, Lightbulb, TrendingUp, MessageCircle, Sparkles } from 'lucide-react'

const ChatTab = ({ user }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const messagesEndRef = useRef(null)

  const suggestions = [
    "How do I start investing with $100?",
    "RRSP vs TFSA?",
    "What's a good student credit card?",
    "Why is my money disappearing?",
    "How to build an emergency fund?",
    "Best apps for tracking expenses?",
    "Should I pay off debt or invest first?",
    "How to improve my credit score?"
  ]

  const quickActions = [
    { icon: Lightbulb, text: "Explain like I'm 10", action: "simple" },
    { icon: TrendingUp, text: "Show examples", action: "examples" },
    { icon: MessageCircle, text: "What's next?", action: "next" }
  ]

  useEffect(() => {
    // Rotate suggestions every 3 seconds
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (messageText = message) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: getAIResponse(messageText),
        sender: 'ai',
        timestamp: new Date(),
        suggestions: getFollowUpSuggestions(messageText)
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userMessage) => {
    // Simulate different responses based on message content
    if (userMessage.toLowerCase().includes('invest')) {
      return "Great question! For students starting with $100, I'd recommend beginning with a low-cost index fund through a TFSA. This gives you diversification and tax-free growth. Would you like me to explain how TFSAs work or show you some beginner-friendly investment platforms?"
    } else if (userMessage.toLowerCase().includes('credit card')) {
      return "For students, I recommend looking for cards with no annual fee and good rewards on categories you spend in most (like groceries or gas). The TD Student Visa and Scotiabank SCENE Visa are popular choices. Building credit early is smart - just remember to pay the full balance each month!"
    } else if (userMessage.toLowerCase().includes('rrsp') || userMessage.toLowerCase().includes('tfsa')) {
      return "TFSA vs RRSP is a common question! As a student, TFSA is usually better because: 1) Withdrawals are tax-free 2) You can re-contribute withdrawn amounts 3) No impact on government benefits. RRSP is better when you're earning more and want the tax deduction now."
    } else {
      return "I'd be happy to help you with that! Let me break this down in a way that's easy to understand and give you some actionable steps you can take right away."
    }
  }

  const getFollowUpSuggestions = (userMessage) => {
    if (userMessage.toLowerCase().includes('invest')) {
      return ["How do TFSAs work?", "Show me investment apps", "What's an index fund?"]
    } else if (userMessage.toLowerCase().includes('credit')) {
      return ["How to apply for a credit card", "Credit score basics", "Best spending habits"]
    } else {
      return ["Tell me more", "What should I do first?", "Any other tips?"]
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion)
    handleSendMessage(suggestion)
  }

  const handleQuickAction = (action, messageId) => {
    const originalMessage = messages.find(m => m.id === messageId)
    if (!originalMessage) return

    let actionMessage = ""
    switch (action) {
      case 'simple':
        actionMessage = `Can you explain "${originalMessage.text}" in simpler terms?`
        break
      case 'examples':
        actionMessage = `Can you give me specific examples for: "${originalMessage.text}"`
        break
      case 'next':
        actionMessage = `What should I do next after: "${originalMessage.text}"`
        break
    }
    
    handleSendMessage(actionMessage)
  }

  return (
    <div className="chat-tab">
      {/* Header */}
      <div className="chat-header">
        <motion.div 
          className="greeting"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Hey {user.name} 👋</h1>
          <p>What's on your mind?</p>
        </motion.div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 && (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="empty-icon">
              <Sparkles size={48} />
            </div>
            <h3>Ready to chat about money?</h3>
            <p>Ask me anything about saving, investing, credit, or spending. I'm here to help!</p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`message ${msg.sender}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                {msg.sender === 'ai' && msg.suggestions && (
                  <div className="follow-up-suggestions">
                    {msg.suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        className="suggestion-pill"
                        onClick={() => handleSuggestionClick(suggestion)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}
                {msg.sender === 'ai' && (
                  <div className="quick-actions">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.action}
                        className="quick-action-btn"
                        onClick={() => handleQuickAction(action.action, msg.id)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <action.icon size={16} />
                        {action.text}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
              <div className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="message ai typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rotating Suggestions */}
      <div className="rotating-suggestions">
        <AnimatePresence mode="wait">
          <motion.button
            key={currentSuggestionIndex}
            className="rotating-suggestion"
            onClick={() => handleSuggestionClick(suggestions[currentSuggestionIndex])}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw size={16} className="rotate-icon" />
            {suggestions[currentSuggestionIndex]}
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Bank Link CTA */}
      {!user.bankLinked && (
        <motion.div 
          className="bank-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link className="bank-cta-icon" />
          <div className="bank-cta-content">
            <span className="bank-cta-title">Get personalized insights</span>
            <span className="bank-cta-subtitle">Link your bank → See your habits</span>
          </div>
          <button className="bank-cta-btn">Connect</button>
        </motion.div>
      )}

      {/* Input */}
      <div className="chat-input-container">
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything…"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="message-input"
          />
          <motion.button
            className={`send-btn ${message.trim() ? 'active' : ''}`}
            onClick={() => handleSendMessage()}
            disabled={!message.trim()}
            whileHover={message.trim() ? { scale: 1.1 } : {}}
            whileTap={message.trim() ? { scale: 0.9 } : {}}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ChatTab
