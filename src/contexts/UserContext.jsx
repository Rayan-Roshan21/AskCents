import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [plaidData, setPlaidData] = useState(null)

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('askCentsUser')
    const savedPlaidData = localStorage.getItem('askCentsPlaidData')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedPlaidData) {
      setPlaidData(JSON.parse(savedPlaidData))
    }
    setIsLoading(false)
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('askCentsUser', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    if (plaidData) {
      localStorage.setItem('askCentsPlaidData', JSON.stringify(plaidData))
    }
  }, [plaidData])

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }))
  }

  const updatePlaidData = (data) => {
    setPlaidData(data)
  }

  const clearUserData = () => {
    setUser(null)
    setPlaidData(null)
    localStorage.removeItem('askCentsUser')
    localStorage.removeItem('askCentsPlaidData')
  }

  const value = {
    user,
    plaidData,
    isLoading,
    updateUser,
    updatePlaidData,
    clearUserData,
    setUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
