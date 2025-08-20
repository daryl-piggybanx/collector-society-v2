import { motion } from "motion/react"
import { Check, ScrollText } from "lucide-react"
import { Checkbox } from "~/components/ui/checkbox"
import type { FormData } from "~/components/form/types"
import { useLocation } from "@tanstack/react-router"

interface CommunityRulesProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  rules: string[]
}

export default function CommunityRules({ formData, updateFormData, rules }: CommunityRulesProps) {
  const location = useLocation()
  const isReservationRoute = location.pathname === '/collector/reservation';

  const handleRuleCheck = (index: number, checked: boolean) => {
    const updatedRules = [...formData.rules_accepted]
    updatedRules[index] = checked
    updateFormData({ rules_accepted: updatedRules })
  }

  const allRulesAccepted = formData.rules_accepted.every((rule) => rule)

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
        <ScrollText size={28} className="text-white" />
        <h2 className="text-2xl font-bold text-white">
          {isReservationRoute ? "Before you continue" : formData.is_returning_collector ? "Before you continue" : "Before we get started"}
        </h2>
      </motion.div>

      <motion.p variants={itemVariants} className="text-lg mb-8 text-white/90">
        {isReservationRoute 
          ? "Please check the boxes below to confirm you’ve read and understand the guidelines for this collection."
          : formData.is_returning_collector ? "Here is a reminder of our community guidelines"
          : "Please check the boxes below to confirm you've read and understand the community guidelines."}
      </motion.p>

      <motion.div variants={itemVariants} className="bg-white/10 rounded-lg p-6 border border-white/30">
        <ul className="space-y-4">
          {rules.map((rule, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { delay: index * 0.1 + 0.3 },
              }}
              className="flex items-start gap-3"
            >
              <Checkbox
                id={`rule-${index}`}
                checked={formData.rules_accepted[index]}
                onCheckedChange={(checked) => handleRuleCheck(index, checked === true)}
                className="mt-1 data-[state=checked]:bg-white data-[state=checked]:text-white border-white"
              />
              <label htmlFor={`rule-${index}`} className="text-white/90 cursor-pointer">
                {rule}
              </label>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className={`mt-6 flex items-center justify-center p-3 rounded-md transition-all ${
          allRulesAccepted ? "bg-white/30 text-white" : "bg-white/10 text-white/50"
        }`}
      >
        <Check size={18} className="mr-2" />
        <span>
          {allRulesAccepted ? "All rules accepted! You can continue." : "Please accept all rules to continue"}
        </span>
      </motion.div>
    </motion.div>
  )
}
