"use client"

import type React from "react"

import { motion } from "motion/react"
import { Users } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/components/form/types"

interface CommunityExperienceProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export default function CommunityExperience({ formData, updateFormData }: CommunityExperienceProps) {
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
        <Users size={28} className="text-red-300" />
        <h2 className="text-2xl font-bold text-red-100">
          {formData.first_name ? `${formData.first_name}, ` : ""}
          share your community experience
        </h2>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="communityExperience" className="text-lg text-red-200">
            What is your favorite part about collecting our work or about the community?
          </Label>
          <Textarea
            id="community_experience"
            name="community_experience"
            value={formData.community_experience}
            onChange={handleInputChange}
            placeholder="Tell us what you love most..."
            className="min-h-[120px] border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="improvements" className="text-lg text-red-200">
            What would make this collecting experience even better?
          </Label>
          <Textarea
            id="improvements"
            name="improvements"
            value={formData.improvements}
            onChange={handleInputChange}
            placeholder="Share your ideas for improvement..."
            className="min-h-[120px] border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
