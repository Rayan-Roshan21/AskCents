// Security utilities for handling sensitive data

/**
 * Safe logging function that prevents sensitive data from being logged
 * @param {string} message - The message to log
 * @param {any} data - Optional data (will be sanitized)
 */
export const safeLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      // Only log non-sensitive properties
      const safeData = sanitizeForLogging(data)
      console.log(message, safeData)
    } else {
      console.log(message)
    }
  }
}

/**
 * Sanitizes data by removing sensitive fields before logging
 * @param {any} data - Data to sanitize
 * @returns {any} - Sanitized data
 */
const sanitizeForLogging = (data) => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const sensitiveFields = [
    'access_token',
    'public_token',
    'account_id',
    'routing_number',
    'account_number',
    'balance',
    'balances',
    'transactions',
    'identity',
    'accounts',
    'email',
    'phone',
    'address',
    'ssn',
    'tax_id'
  ]

  const sanitized = { ...data }

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]'
    }
  })

  return sanitized
}

/**
 * Sanitizes error objects for safe logging
 * @param {Error} error - Error object
 * @returns {object} - Sanitized error info
 */
export const sanitizeError = (error) => {
  return {
    message: error.message || 'Unknown error',
    code: error.code || 'UNKNOWN',
    timestamp: new Date().toISOString()
  }
}

/**
 * Checks if environment variables are properly configured
 * @returns {object} - Configuration status
 */
export const validateEnvironmentSecurity = () => {
  const requiredEnvVars = [
    'VITE_PLAID_CLIENT_ID',
    'VITE_PLAID_SECRET',
    'VITE_API_URL'
  ]

  const missing = requiredEnvVars.filter(varName => !import.meta.env[varName])
  
  return {
    isValid: missing.length === 0,
    missing,
    recommendations: missing.length > 0 ? [
      'Set missing environment variables in .env file',
      'Ensure .env file is in .gitignore',
      'Use different values for development and production'
    ] : []
  }
}

/**
 * Validates that sensitive data is properly encrypted in localStorage
 * @returns {boolean} - Whether localStorage usage is secure
 */
export const validateLocalStorageSecurity = () => {
  try {
    const sensitiveKeys = [
      'askCentsUser',
      'askCentsPlaidData',
      'askCentsPoints',
      'askCentsCompletedTasks'
    ]

    let hasUnencryptedSensitiveData = false

    sensitiveKeys.forEach(key => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          // Check if data contains obviously sensitive fields that should be encrypted
          if (parsed.access_token || parsed.account_number || parsed.routing_number) {
            hasUnencryptedSensitiveData = true
          }
        } catch (e) {
          // If we can't parse it, it might be encrypted (which is good)
        }
      }
    })

    return !hasUnencryptedSensitiveData
  } catch (error) {
    safeLog('Error validating localStorage security', sanitizeError(error))
    return false
  }
}

export default {
  safeLog,
  sanitizeError,
  validateEnvironmentSecurity,
  validateLocalStorageSecurity
}
