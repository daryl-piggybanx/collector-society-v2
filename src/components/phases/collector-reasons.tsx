"use client"

import type React from "react"

import { motion } from "motion/react"
import { Heart } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/components/form/types"

interface CollectorReasonsProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export default function CollectorReasons({ formData, updateFormData }: CollectorReasonsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
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
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <Heart size={28} className="text-red-300" />
        <h2 className="text-2xl font-bold text-red-100">
          {formData.first_name ? `${formData.first_name}, ` : ""}
          tell us more about your interest
        </h2>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="collectionReason" className="text-lg text-red-200">
          Why do you want to collect our art?*
          </Label>
          <Textarea
            id="collection_reason"
            name="collection_reason"
            value={formData.collection_reason}
            onChange={handleInputChange}
            placeholder="Share your motivation for collecting..."
            className="min-h-[120px] border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="interests" className="text-lg text-red-200">
            What interests you the most about our work?*
          </Label>
          <Textarea
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            placeholder="Tell us what draws you to our art..."
            className="min-h-[120px] border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}