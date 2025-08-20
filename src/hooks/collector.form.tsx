import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './demo.form-context'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Form container that matches existing styling
export function FormContainer({ 
  children,
  currentPhase,
  totalPhases,
  isComplete,
  progressPercentage,
  handleNext,
  handleBack,
  handleSubmit,
  isNextDisabled,
  isSubmitting
}: {
  children: React.ReactNode
  currentPhase: number
  totalPhases: number
  isComplete: boolean
  progressPercentage: number
  handleNext: () => void
  handleBack: () => void
  handleSubmit: () => void
  isNextDisabled: () => boolean
  isSubmitting: boolean
}) {
  return (
    <div className="w-full max-w-3xl">
      <motion.div
        className="bg-rose-950/30 backdrop-blur-sm border border-rose-400/20 rounded-2xl shadow-xl overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>

          {/* Navigation buttons */}
          {!isComplete && (
            <div className="flex justify-between mt-8">
              {currentPhase > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2 bg-rose-950/40 border-rose-400/30 text-rose-100 hover:bg-rose-800/50 hover:text-rose-50"
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              )}

              {currentPhase < totalPhases && (
                <Button
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className="ml-auto flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-rose-50"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              )}

              {currentPhase === totalPhases && (
                <Button
                  onClick={handleSubmit}
                  disabled={isNextDisabled() || isSubmitting}
                  className="ml-auto flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-rose-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                      <Check size={16} />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {!isComplete && (
          <div className="px-8 pb-6">
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-rose-200/80 mt-2">
              Step {currentPhase} of {totalPhases}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export function useFormState() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  return { currentPhase, setCurrentPhase, isComplete, setIsComplete }
}

export const { useAppForm: useCollectorForm } = createFormHook({
  formComponents: {
    FormContainer,
  },
  fieldComponents: {},
  fieldContext,
  formContext,
})
