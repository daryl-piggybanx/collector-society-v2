import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Home, Building } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/components/form/types"

interface ShippingAddressProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export default function ShippingAddress({ formData, updateFormData }: ShippingAddressProps) {
  // Field change handlers
  const handleAddressLine1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateFormData({ shipping_address_line_1: value })
  }

  const handleAddressLine2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateFormData({ shipping_address_line_2: value })
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
      {/* <motion.p variants={itemVariants} className="text-red-100/80 my-6">
        Please provide your shipping address for delivery of your PiggyBanx collection.
      </motion.p> */}
      
      <motion.div variants={itemVariants} className="space-y-6 my-6">
        {/* Shipping Address Line 1 */}
        <div className="space-y-3">
          <Label htmlFor="shipping_address_line_1" className="text-red-200">
            Shipping Address Line 1 *
          </Label>
          <div className="flex items-center">
            <Input
              id="shipping_address_line_1"
              name="shipping_address_line_1"
              type="text"
              value={formData.shipping_address_line_1 || ''}
              onChange={handleAddressLine1Change}
              placeholder="123 Main Street, City, State 12345"
              className="border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400"
              required
            />
          </div>
        </div>

        {/* Shipping Address Line 2 (Optional) */}
        <div className="space-y-3">
          <Label htmlFor="shipping_address_line_2" className="text-red-200">
            Shipping Address Line 2 (Optional)
          </Label>
          <div className="flex items-center">
            <Input
              id="shipping_address_line_2"
              name="shipping_address_line_2"
              type="text"
              value={formData.shipping_address_line_2 || ''}
              onChange={handleAddressLine2Change}
              placeholder="Apt, Suite, Floor, Country, etc."
              className="border-red-400/30 bg-red-950/40 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}