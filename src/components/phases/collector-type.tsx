"use client"

import { motion } from "motion/react"
import { UserPlus, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FormData } from "@/components/form/types"

interface CollectorTypeProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export default function CollectorType({ formData, updateFormData }: CollectorTypeProps) {
  const handleSelection = (isReturning: boolean) => {
    updateFormData({ is_returning_collector: isReturning })
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-rose-100">
        Are you a new or returning collector?
      </motion.h2>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 justify-center mt-12">
        <Button
          variant={formData.is_returning_collector === false ? "default" : "outline"}
          size="lg"
          onClick={() => handleSelection(false)}
          className={`flex items-center gap-3 p-8 text-lg transition-all ${
            formData.is_returning_collector === false
              ? "bg-rose-600 hover:bg-rose-500 text-white scale-105"
              : "bg-rose-950/40 border-rose-400/30 text-rose-100 hover:bg-rose-800/50 hover:text-rose-50"
          }`}
        >
          <UserPlus size={24} />
          <span>I'm a new collector</span>
        </Button>

        <Button
          variant={formData.is_returning_collector === true ? "default" : "outline"}
          size="lg"
          onClick={() => handleSelection(true)}
          className={`flex items-center gap-3 p-8 text-lg transition-all ${
            formData.is_returning_collector === true
              ? "bg-rose-600 hover:bg-rose-500 text-white scale-105"
              : "bg-rose-950/40 border-rose-400/30 text-rose-100 hover:bg-rose-800/50 hover:text-rose-50"
          }`}
        >
          <UserCheck size={24} />
          <span>I'm a returning collector</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}
