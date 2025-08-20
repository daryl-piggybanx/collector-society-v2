"use client"

import { motion } from "motion/react"
import {
  CheckCircle,
  User,
  MessageSquare,
  Star,
  Target,
  Plus,
  Mail,
  Phone,
  Trophy,
  Music,
  Sparkles,
  Gamepad2,
  Film,
  Palette,
  Car,
} from "lucide-react"
import type { FormData } from "@/components/form/types"

interface SuccessPageProps {
  formData: FormData
  preferences: { name: string; icon: string }[]
  variations: string[]
}

export default function SuccessPage({ formData, preferences, variations }: SuccessPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Find the selected preference objects
  const selectedPreferences = formData.collect_preferences?.map(
    (name) => preferences.find((p) => p.name === name) || { name, icon: "target" },
  ) || [];

  // Helper function to get selected variations in order
  const getSelectedVariations = (): string[] => {
    const selected: string[] = [];
    if (formData.favorite_variation) selected.push(formData.favorite_variation);
    if (formData.favorite_variation_2) selected.push(formData.favorite_variation_2);
    if (formData.favorite_variation_3) selected.push(formData.favorite_variation_3);
    return selected;
  }

  const selectedVariations = getSelectedVariations();

  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName: string) => {
    const iconClass = "text-red-300"
    const iconSize = 18

    switch (iconName) {
      case "trophy":
        return <Trophy size={iconSize} className={iconClass} />
      case "music":
        return <Music size={iconSize} className={iconClass} />
      case "sparkles":
        return <Sparkles size={iconSize} className={iconClass} />
      case "gamepad-2":
        return <Gamepad2 size={iconSize} className={iconClass} />
      case "film":
        return <Film size={iconSize} className={iconClass} />
      case "palette":
        return <Palette size={iconSize} className={iconClass} />
      case "car":
        return <Car size={iconSize} className={iconClass} />
      default:
        return <Target size={iconSize} className={iconClass} />
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
      <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 w-100">
          <CheckCircle size={40} className="text-red-100" />
        </div>
        <h2 className="text-3xl font-bold text-red-100">Success!</h2>
        <p className="text-red-100/80 mt-2">Thank you for completing your collector profile.</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-red-900/40 to-orange-800/40 rounded-xl p-6 border border-red-400/30 mb-8 backdrop-blur-sm"
      >
        <h3 className="text-xl font-semibold text-red-200 mb-4">Your Collector Character Sheet</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User size={20} className="text-red-300 mt-1" />
              <div>
                <h4 className="font-medium text-red-200">Personal Info</h4>
                <p className="text-red-100">
                  {formData.first_name} {formData.last_name}
                </p>
                <p className="text-red-100/70 text-sm">{formData.discord_username}</p>
                <p className="text-red-100/70 text-sm">{formData.instagram_handle}</p>
              </div>
            </div>

            {formData.is_returning_collector && (
              <div className="flex items-start gap-3">
                <MessageSquare size={20} className="text-red-300 mt-1" />
                <div>
                  <h4 className="font-medium text-red-200">Collection Stats</h4>
                  {selectedVariations.length > 0 && (
                    <p className="text-red-100/70">
                      Favorite variation{selectedVariations.length > 1 ? 's' : ''}: {' '}
                      <span className="text-red-300">
                        {selectedVariations.map((variation, index) => (
                          <span key={variation}>
                            {variation}
                            {index < selectedVariations.length - 1 && ', '}
                          </span>
                        ))}
                      </span>
                    </p>
                  )}
                  {formData.first_piece && (
                    <p className="text-red-100/70">
                      First piece: <span className="text-red-300">{formData.first_piece}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Target size={20} className="text-red-300 mt-1" />
              <div>
                <h4 className="font-medium text-red-200">Collection Interests</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedPreferences.map((preference, index) => (
                    <div
                      key={preference.name}
                      className="inline-flex items-center gap-1 bg-red-800/60 text-red-100 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{index + 1}. </span>
                      {renderIcon(preference.icon)}
                      <span>{preference.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {formData.category_to_add && (
              <div className="flex items-start gap-3">
                <Plus size={20} className="text-red-300 mt-1" />
                <div>
                  <h4 className="font-medium text-red-200">Suggested Category</h4>
                  <p className="text-red-100">{formData.category_to_add}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-red-300 mt-1" />
              <div>
                <h4 className="font-medium text-red-200">Contact Info</h4>
                <p className="text-red-100">{formData.email}</p>
                {formData.phone_number && <p className="text-red-100/70">{formData.phone_number}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={20} className="text-red-300 mt-1" />
              <div>
                <h4 className="font-medium text-red-200">Communication Preference</h4>
                <p className="text-red-100 capitalize">{formData.communication_preference}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Star size={20} className="text-red-300 mt-1" />
              <div>
                <h4 className="font-medium text-red-200">Collector Status</h4>
                <p className="text-red-100">
                  {formData.is_returning_collector ? "Returning Collector" : "New Collector"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.p variants={itemVariants} className="text-red-100/80">
        We'll be in touch soon with exciting collection opportunities!
      </motion.p>
    </motion.div>
  )
}
