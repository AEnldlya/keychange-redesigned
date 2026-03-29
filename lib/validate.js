/**
 * Client-side form validation utilities
 */

export function validateEmail(email) {
  if (!email) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!re.test(email)) return 'Please enter a valid email address'
  return null
}

export function validatePhone(phone) {
  if (!phone) return 'Phone number is required'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) return 'Phone number must be at least 10 digits'
  return null
}

export function validateRequired(value, label = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${label} is required`
  }
  return null
}

export function validateFileSize(file, maxMB = 5) {
  if (!file) return 'Please upload an image'
  if (file.size > maxMB * 1024 * 1024) {
    return `File must be under ${maxMB}MB (yours is ${(file.size / 1024 / 1024).toFixed(1)}MB)`
  }
  return null
}

export function validateDate(date) {
  if (!date) return 'Please select a date'
  const selected = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (selected < today) return 'Please select today or a future date'
  return null
}

/**
 * Run all validations, return error object (field → message) or null if valid
 */
export function validateForm(data, rules) {
  const errors = {}
  for (const [field, validators] of Object.entries(rules)) {
    for (const validate of validators) {
      const error = validate(data[field])
      if (error) {
        errors[field] = error
        break
      }
    }
  }
  return Object.keys(errors).length > 0 ? errors : null
}
