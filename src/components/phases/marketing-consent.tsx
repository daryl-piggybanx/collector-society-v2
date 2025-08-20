import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormData } from "@/components/form/types"
import {
  validateEmail,
  validatePhoneNumber,
  formatPhoneNumberAsYouType,
  formatPhoneToE164,
  getFormattedPhoneNumber,
  isPhoneNumberPossible,
  ensurePlusPrefix,
  createFieldState,
  updateFieldState,
  type FieldValidationState
} from "@/utils/validation"
import { useLocation } from "@tanstack/react-router"

interface MarketingConsentProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export default function MarketingConsent({ formData, updateFormData }: MarketingConsentProps) {
  const location = useLocation()
  const isDiscordRoute = location.pathname === '/collector/discord';
  const isReservationRoute = location.pathname === '/collector/reservation';

  // local validation state
  const [emailState, setEmailState] = useState<FieldValidationState>(() => 
    createFieldState(formData.email)
  )
  const [phoneState, setPhoneState] = useState<FieldValidationState>(() => {
    // Extract digits only for display, even if form data has +1 prefix
    const phoneDisplay = formData.phone_number ? 
      formData.phone_number.replace(/^\+1/, '').replace(/\D/g, '') : ''
    return createFieldState(phoneDisplay)
  })

  // sync with form data when it changes externally
  useEffect(() => {
    if (formData.email !== emailState.value) {
      setEmailState(prev => updateFieldState(prev, { value: formData.email }))
    }
  }, [formData.email])

  useEffect(() => {
    // Extract digits only for display, even if form data has +1 prefix
    const phoneDisplay = formData.phone_number ? 
      formData.phone_number.replace(/^\+1/, '').replace(/\D/g, '') : ''
    if (phoneDisplay !== phoneState.value) {
      setPhoneState(prev => updateFieldState(prev, { value: phoneDisplay }))
    }
  }, [formData.phone_number])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // update local state immediately for responsive UI
    setEmailState(prev => updateFieldState(prev, { 
      value, 
      isTouched: true 
    }))
    
    // update form data
    updateFormData({ email: value })
  }

  const handleEmailBlur = () => {
    const validation = validateEmail(emailState.value)
    setEmailState(prev => updateFieldState(prev, {
      error: validation.error,
      isValid: validation.isValid
    }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Keep only digits for user display
    const digitsOnly = value.replace(/\D/g, '')
    
    // Update local state with digits only (what user sees)
    setPhoneState(prev => updateFieldState(prev, { 
      value: digitsOnly,
      isTouched: true,
      isValid: false, // Set to false while typing
      error: undefined
    }))
    
    // Store digits only in form data during typing (validation will add +1 later)
    updateFormData({ phone_number: digitsOnly })
  }

  const handlePhoneBlur = () => {
    if (!phoneState.value.trim()) {
      // If empty, that's okay (optional field)
      setPhoneState(prev => updateFieldState(prev, {
        error: undefined,
        isValid: true
      }))
      updateFormData({ phone_number: '' })
      return
    }

    // Validate the phone number (validation function will add +1 automatically)
    const validation = validatePhoneNumber(phoneState.value, 'US')
    
    // Update form data with E.164 format for Klaviyo if valid, otherwise keep digits only
    const formValue = validation.isValid && validation.formattedValue 
      ? validation.formattedValue  // E.164 format (+1XXXXXXXXXX) for Klaviyo
      : phoneState.value           // Keep user's digits if invalid

    updateFormData({ phone_number: formValue })
    
    // Update local validation state
    setPhoneState(prev => updateFieldState(prev, {
      error: validation.error,
      isValid: validation.isValid
    }))
  }

  const handleCommunicationChange = (value: string) => {
    updateFormData({ communication_preference: value })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      {!formData.is_returning_collector && (
        <motion.p variants={itemVariants} className="text-red-100/80 my-6">
          We'll use this information to keep you updated on new collections and events.
        </motion.p>
      )}
      
      <motion.div variants={itemVariants} className="space-y-6 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-red-200">
            Email Address*
          </Label>
          <div className="flex items-center">
            <Mail size={18} className="text-red-300 mr-2" />
            <Input
              id="email"
              name="email"
              type="email"
              value={emailState.value}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Email Address"
              className={`border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400 ${
                emailState.isTouched && !emailState.isValid ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
              }`}
              required
              aria-invalid={emailState.isTouched && !emailState.isValid}
              aria-describedby={emailState.error ? "email-error" : undefined}
            />
          </div>
          {emailState.isTouched && emailState.error && (
            <p id="email-error" className="text-red-400 text-sm mt-1">
              {emailState.error}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-red-200">
            Phone Number (United States only)
          </Label>
          <div className="flex items-center">
            <Phone size={18} className="text-red-300 mr-2" />
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={phoneState.value}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              placeholder="Phone number (e.g., 5628842097)"
              className={`border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400 ${
                phoneState.isTouched && !phoneState.isValid ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
              }`}
              aria-invalid={phoneState.isTouched && !phoneState.isValid}
              aria-describedby={phoneState.error ? "phone-error" : undefined}
            />
          </div>
          {phoneState.isTouched && phoneState.error && (
            <p id="phone-error" className="text-red-400 text-sm mt-1">
              {phoneState.error}
            </p>
          )}
          {!phoneState.error && phoneState.value && phoneState.isValid && (
            <p className="text-red-300/70 text-sm mt-1">
              ✓ Valid phone number
            </p>
          )}
        </div>
      </div>

        {!formData.is_returning_collector && !isDiscordRoute && !isReservationRoute && (
          <>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="marketing_consent" 
                  checked={formData.marketing_consent}
                  onCheckedChange={(checked) => updateFormData({ marketing_consent: checked === true })}
                  className="mt-1 data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-red-400 cursor-pointer"
                />
                <Label htmlFor="marketing_consent" className="text-red-200 cursor-pointer leading-relaxed">
                  Check this box to also receive promotional marketing texts.
                </Label>
                { formData.marketing_consent && !phoneState.value && (
                  <p className="text-red-300/70 text-sm mt-1">
                    Please enter a valid phone number
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-red-100/80 text-sm leading-relaxed">
                By submitting this form and signing up for texts, you consent to receive marketing text messages (e.g. promos, cart reminders) from PiggyBanx at the number provided, including messages sent by autodialer. Consent is not a condition of purchase. Msg & data rates may apply. Msg frequency varies. Unsubscribe at any time by replying STOP or clicking the unsubscribe link (where available). 
              </p>
            </div>

            <div className="">
              <Label className="text-red-200 mb-4">Communication Preference</Label>
              <RadioGroup
                value={formData.communication_preference}
                onValueChange={handleCommunicationChange}
                className="flex flex-row gap-4 md:gap-3 md:justify-start md:items-start"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="Email"
                    id="comm-email"
                    className="data-[state=checked]:border-red-500 data-[state=checked]:text-red-500"
                  />
                  <Label htmlFor="comm-email" className="text-red-100">
                    Email
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="Text"
                    id="comm-phone"
                    className="data-[state=checked]:border-red-500 data-[state=checked]:text-red-500"
                  />
                  <Label htmlFor="comm-phone" className="text-red-100">
                    Phone
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="Both"
                    id="comm-both"
                    className="data-[state=checked]:border-red-500 data-[state=checked]:text-red-500"
                  />
                  <Label htmlFor="comm-both" className="text-red-100">
                    Both
                  </Label>
                </div>
              </RadioGroup>
              <div className="">
                { formData.communication_preference === "Email" && !emailState.value && (
                  <p className="text-red-300/70 text-sm mt-1">
                    Please enter a valid email address
                  </p>
                )}
                { formData.communication_preference === "Text" && !phoneState.value && (
                  <p className="text-red-300/70 text-sm mt-1">
                    Please enter a valid phone number
                  </p>
                )}
                { formData.communication_preference === "Both" && (!emailState.value || !phoneState.value) && (
                  <p className="text-red-300/70 text-sm mt-1">
                    Please enter a valid email address and phone number
                  </p>
                )}
              </div>
            </div>

          </>
        )}
      </motion.div>
    </motion.div>
  )
}
