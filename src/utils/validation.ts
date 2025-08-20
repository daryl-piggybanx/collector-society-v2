import { 
  parsePhoneNumber, 
  isValidPhoneNumber, 
  isPossiblePhoneNumber,
  validatePhoneNumberLength,
  AsYouType 
} from 'libphonenumber-js'

export interface ValidationResult {
  isValid: boolean
  error?: string
  formattedValue?: string
}

export interface FieldValidationState {
  value: string
  error?: string
  isValid: boolean
  isTouched: boolean
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

export const validatePhoneNumber = (phoneNumber: string, defaultCountry: string = 'US'): ValidationResult => {
  if (!phoneNumber.trim()) {
    return { isValid: true } // phone is optional
  }

  try {
    // NEW SIMPLIFIED LOGIC FOR US 10-DIGIT NUMBERS
    // Clean the input - remove all non-digits
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    
    // For US numbers, we expect exactly 10 digits
    if (digitsOnly.length !== 10) {
      let errorMessage = 'Please enter a valid 10-digit phone number'
      
      if (digitsOnly.length < 10) {
        errorMessage = 'Phone number is too short - please enter 10 digits'
      } else if (digitsOnly.length > 10) {
        errorMessage = 'Phone number is too long - please enter 10 digits'
      }
      
      return { isValid: false, error: errorMessage }
    }
    
    // Create the full phone number with +1 prefix for validation
    const phoneForValidation = `+1${digitsOnly}`
    
    // Validate the full phone number
    if (!isValidPhoneNumber(phoneForValidation, defaultCountry)) {
      return { 
        isValid: false, 
        error: 'Please enter a valid 10-digit phone number (e.g., 5628842097)' 
      }
    }

    // Parse for formatting
    const parsed = parsePhoneNumber(phoneForValidation, defaultCountry)
    
    if (!parsed) {
      return { 
        isValid: false, 
        error: 'Unable to parse phone number' 
      }
    }

    // Return E.164 format (+1XXXXXXXXXX) for Klaviyo
    return { 
      isValid: true, 
      formattedValue: parsed.number // E.164 format with +1
    }

    // OLD INTERNATIONAL LOGIC (COMMENTED OUT FOR FUTURE USE)
    // // Automatically prepend +1 for US numbers if not present
    // let phoneForValidation = phoneNumber.trim()
    // 
    // // If it's just digits and doesn't start with +, assume it's US number
    // if (/^\d+$/.test(phoneForValidation)) {
    //   phoneForValidation = `+1${phoneForValidation}`
    // } else if (phoneForValidation.startsWith('1') && phoneForValidation.length === 11) {
    //   // Handle case where user enters 1XXXXXXXXXX (11 digits starting with 1)
    //   phoneForValidation = `+${phoneForValidation}`
    // } else if (!phoneForValidation.startsWith('+') && phoneForValidation.startsWith('1')) {
    //   // Handle other cases where user might enter 1 followed by 10 digits
    //   phoneForValidation = `+${phoneForValidation}`
    // } else if (!phoneForValidation.startsWith('+')) {
    //   // If no + and not starting with 1, assume US number
    //   phoneForValidation = `+1${phoneForValidation}`
    // }

    // // check if a possible phone number (length validation)
    // if (!isPossiblePhoneNumber(phoneForValidation, defaultCountry)) {
    //   const lengthValidation = validatePhoneNumberLength(phoneForValidation, defaultCountry)
    //   
    //   let errorMessage = 'Please enter a valid phone number'
    //   
    //   switch (lengthValidation) {
    //     case 'TOO_SHORT':
    //       errorMessage = 'Phone number is too short'
    //       break
    //     case 'TOO_LONG':
    //       errorMessage = 'Phone number is too long'
    //       break
    //     // case 'INVALID_COUNTRY':
    //     //   errorMessage = 'Invalid country code'
    //     //   break
    //     case 'INVALID_LENGTH':
    //       errorMessage = 'Invalid phone number length'
    //       break
    //     default:
    //       errorMessage = 'Please enter a valid 10-digit phone number (e.g., 5628842097)'
    //   }
    //   
    //   return { isValid: false, error: errorMessage }
    // }

    // // validate actual phone number digits
    // if (!isValidPhoneNumber(phoneForValidation, defaultCountry)) {
    //   return { 
    //     isValid: false, 
    //     error: 'Please enter a valid 10-digit phone number (e.g., 5628842097)' 
    //   }
    // }

    // // parse for formatting
    // const parsed = parsePhoneNumber(phoneForValidation, defaultCountry)
    // 
    // if (!parsed) {
    //   return { 
    //     isValid: false, 
    //     error: 'Unable to parse phone number' 
    //   }
    // }

    // // return E.164 format (+1XXXXXXXXXX) for Klaviyo
    // return { 
    //   isValid: true, 
    //   formattedValue: parsed.number // E.164 format with +1
    // }
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Please enter a valid 10-digit phone number (e.g., 5628842097)' 
    }
  }
}

export const formatPhoneNumberAsYouType = (value: string, country: string = 'US'): string => {
  if (!value) return value
  
  // Keep only digits for display to user
  const digitsOnly = value.replace(/\D/g, '')
  
  // Return raw digits without formatting for now (user sees 10 digits)
  return digitsOnly
}

export const formatPhoneToE164 = (phoneNumber: string, defaultCountry: string = 'US'): string => {
  if (!phoneNumber.trim()) return phoneNumber

  try {
    // Automatically prepend +1 for US numbers if not present
    let phoneForFormatting = phoneNumber.trim()
    
    // If it's just digits, assume it's US number
    if (/^\d+$/.test(phoneForFormatting)) {
      phoneForFormatting = `+1${phoneForFormatting}`
    }
    
    const parsed = parsePhoneNumber(phoneForFormatting, defaultCountry)
    if (parsed && parsed.isValid()) {
      return parsed.number // E.164 format (+1XXXXXXXXXX)
    }
  } catch (error) {
    // If parsing fails, return original value
  }
  
  return phoneNumber
}

// Get formatted phone number for display
export const getFormattedPhoneNumber = (phoneNumber: string, format: 'international' | 'national' = 'national', defaultCountry: string = 'US'): string => {
  if (!phoneNumber.trim()) return phoneNumber

  try {
    const parsed = parsePhoneNumber(phoneNumber, defaultCountry)
    if (parsed && parsed.isValid()) {
      // International formatting commented out for now
      // return format === 'international' 
      //   ? parsed.formatInternational() 
      //   : parsed.formatNational()
      
      // For now, just return national format or raw digits
      return format === 'national' ? parsed.formatNational() : phoneNumber
    }
  } catch (error) {
    // If parsing fails, return original value
  }
  
  return phoneNumber
}

// check if phone number is possible (length validation only)
export const isPhoneNumberPossible = (phoneNumber: string, defaultCountry: string = 'US'): boolean => {
  if (!phoneNumber.trim()) return true // Optional field
  
  try {
    // Automatically prepend +1 for US numbers if not present
    let phoneForCheck = phoneNumber.trim()
    if (/^\d+$/.test(phoneForCheck)) {
      phoneForCheck = `+1${phoneForCheck}`
    }
    
    return isPossiblePhoneNumber(phoneForCheck, defaultCountry)
  } catch (error) {
    return false
  }
}

// ensure phone number starts with +1 for US numbers
export const ensurePlusPrefix = (phoneNumber: string): string => {
  if (!phoneNumber.trim()) return phoneNumber
  
  // Remove any existing + and whitespace
  const cleaned = phoneNumber.replace(/^\+?\s*/, '').replace(/\D/g, '')
  
  // Always add +1 for US numbers
  return cleaned ? `+1${cleaned}` : ''
}

// validation state management helpers
export const createFieldState = (initialValue: string = ''): FieldValidationState => ({
  value: initialValue,
  error: undefined,
  isValid: true,
  isTouched: false
})

export const updateFieldState = (
  currentState: FieldValidationState,
  updates: Partial<FieldValidationState>
): FieldValidationState => ({
  ...currentState,
  ...updates
})
