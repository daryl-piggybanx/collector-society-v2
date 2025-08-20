"use client"

import type React from "react"

import { motion } from "motion/react"
import { PlusCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/components/form/types"

interface NewCategoriesProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export default function NewCategories({ formData, updateFormData }: NewCategoriesProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ category_to_add: e.target.value })
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
        <PlusCircle size={28} className="text-rose-300" />
        <h2 className="text-2xl font-bold text-rose-100">
          {formData.first_name ? `${formData.first_name}, ` : ""}
          what category would you want added?
        </h2>
      </motion.div>

      <motion.p variants={itemVariants} className="text-rose-100/80 mb-6">
        We're always looking to expand our collection categories. Let us know what you'd like to see!
      </motion.p>

      <motion.div variants={itemVariants} className="space-y-3">
        <Label htmlFor="categoryToAdd" className="text-rose-200">
          Suggest a new category
        </Label>
        <Textarea
          id="category_to_add"
          value={formData.category_to_add}
          onChange={handleInputChange}
          placeholder="Enter your suggestion here..."
          className="min-h-[120px] border-rose-400/30 bg-rose-950/40 text-rose-100 placeholder:text-rose-300/50 focus:border-rose-400 focus:ring-rose-400"
        />
      </motion.div>

      <motion.p variants={itemVariants} className="mt-4 text-sm text-rose-300/70 italic">
        This field is optional. Feel free to skip if you don't have any suggestions.
      </motion.p>
    </motion.div>
  )
}
