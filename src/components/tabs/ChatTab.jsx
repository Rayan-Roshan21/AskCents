import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, Link, Lightbulb, TrendingUp, MessageCircle, Sparkles, Trash2 } from 'lucide-react'
import { GoogleGenerativeAI } from "@google/generative-ai"

const ChatTab = ({ user }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const [conversationHistory, setConversationHistory] = useState([])
  const messagesEndRef = useRef(null)

  // Initialize Google AI (you'll need to set your API key)
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
  const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null

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
    // Load conversation history from session storage when component mounts
    const savedMessages = sessionStorage.getItem('askCentsMessages')
    const savedHistory = sessionStorage.getItem('askCentsHistory')
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      } catch (error) {
        console.error('Error loading saved messages:', error)
      }
    }
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setConversationHistory(parsedHistory)
      } catch (error) {
        console.error('Error loading conversation history:', error)
      }
    }

    // Save conversation when component unmounts or user navigates away
    const handleBeforeUnload = () => {
      sessionStorage.setItem('askCentsMessages', JSON.stringify(messages))
      sessionStorage.setItem('askCentsHistory', JSON.stringify(conversationHistory))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // Save current state when component unmounts
      sessionStorage.setItem('askCentsMessages', JSON.stringify(messages))
      sessionStorage.setItem('askCentsHistory', JSON.stringify(conversationHistory))
    }
  }, [])

  // Save messages and history whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('askCentsMessages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (conversationHistory.length > 0) {
      sessionStorage.setItem('askCentsHistory', JSON.stringify(conversationHistory))
    }
  }, [conversationHistory])

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

    // Add user message to conversation history
    const newUserHistory = { role: 'user', content: messageText }
    setConversationHistory(prev => [...prev, newUserHistory])

    try {
      // Get AI response from Google Generative AI with conversation context
      const aiResponse = await getAIResponse(messageText, [...conversationHistory, newUserHistory])
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: getFollowUpSuggestions(messageText)
      }
      setMessages(prev => [...prev, aiMessage])

      // Add AI response to conversation history
      const newAiHistory = { role: 'assistant', content: aiResponse }
      setConversationHistory(prev => [...prev, newAiHistory])

    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const getAIResponse = async (userMessage, currentHistory = conversationHistory) => {
    try {
      // Check if API key and model are available
      if (!model || !apiKey) {
        return "Hi! I'm AskCents, your financial advisor chatbot. To use my AI features, please add your Google AI API key to the .env file as VITE_GOOGLE_AI_API_KEY. In the meantime, I'd be happy to help with general financial guidance!"
      }

      // Build conversation context from history
      let conversationContext = ""
      if (currentHistory.length > 0) {
        conversationContext = "\n\nConversation history:\n"
        // Only include the last 10 exchanges to keep context manageable
        const recentHistory = currentHistory.slice(-10)
        recentHistory.forEach((msg, index) => {
          const role = msg.role === 'user' ? 'User' : 'AskCents'
          conversationContext += `${role}: ${msg.content}\n`
        })
        conversationContext += "\n"
      }

      // Create a financial advisor prompt context with conversation memory
      const prompt = `You are AskCents, a friendly and knowledgeable financial advisor chatbot designed specifically for Canadian students and young adults. Your goal is to provide helpful, accurate, and easy-to-understand financial advice.

Context:
- User is a Canadian or American student/young adult
- Focus on Canadian financial products (TFSA, RRSP, Canadian banks, etc.)
- Keep responses conversational, helpful, and not too long
- Keep responses under 100 words
- Always be encouraging and supportive
- Provide actionable advice when possible
- Remember the conversation history and refer to previous topics when relevant
- If the user asks follow-up questions, consider the previous context

${conversationContext}

Current user question: ${userMessage}

Please provide a helpful response that's informative but easy to understand, taking into account our previous conversation:`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating AI response:', error)
      // Fallback to a helpful message
      return "I'd be happy to help you with that financial question! Unfortunately, I'm having a technical issue right now. Could you try asking again? In the meantime, I'd recommend checking with your bank or a financial advisor for urgent questions."
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

  const clearConversation = () => {
    setMessages([])
    setConversationHistory([])
    sessionStorage.removeItem('askCentsMessages')
    sessionStorage.removeItem('askCentsHistory')
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
          <div className="greeting-content">
            <div>
              <h1>Hey {user.name} 👋</h1>
              <p>What's on your mind?</p>
            </div>
            {messages.length > 0 && (
              <motion.button
                className="clear-chat-btn"
                onClick={clearConversation}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Clear conversation"
              >
                <Trash2 size={18} />
              </motion.button>
            )}
          </div>
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
