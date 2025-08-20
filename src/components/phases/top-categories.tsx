import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Target, Check, Trophy, Music, Sparkles, Gamepad2, Film, Palette, Car, ChevronDown, Clapperboard, Warehouse } from "lucide-react"
import { MdCatchingPokemon } from "react-icons/md";
import { PiFlyingSaucer } from "react-icons/pi";
import type { FormData } from "@/components/form/types"

interface Preference {
  name: string
  icon: string
  subcategories: string[]
  klaviyoValue?: string
}

interface TopCategoriesProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  preferences: Preference[]
}

export default function TopCategories({ formData, updateFormData, preferences }: TopCategoriesProps) {
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [showSubcategories, setShowSubcategories] = useState(false)

  // TEMPORARILY DISABLED: Subcategory functionality
  const ENABLE_SUBCATEGORIES = true

  const handlePreferenceToggle = (preference: Preference) => {
    console.log('preference: ', preference)
    if (selectedPreference === preference.name) {
      setShowSubcategories(!showSubcategories)
    } else {
      // If clicking a different preference, select it and show subcategories if available
      setSelectedPreference(preference.name)
      setSelectedSubcategory(null)
      setShowSubcategories(preference.subcategories.length > 0 && ENABLE_SUBCATEGORIES)
    }
    // Update form data with the klaviyoValue if it exists, otherwise use the name
    const valueForKlaviyo = preference.klaviyoValue || preference.name
    updateFormData({ collect_preferences: [valueForKlaviyo] })
  }

  // COMMENTED OUT: Subcategory selection handler (keeping for future use)
  const handleSubcategorySelect = (subcategory: string) => {
    console.log('subcategory: ', subcategory)
    setSelectedSubcategory(subcategory)
    updateFormData({ collect_preferences: [subcategory] })
    setShowSubcategories(true)
  }

  // Initialize from form data if it exists
  useEffect(() => {
    if (formData.collect_preferences && formData.collect_preferences.length > 0) {
      const selected = formData.collect_preferences[0]
      // DISABLED: single category selection
      // const preference = preferences.find(p => p.name === selected)
      // if (preference) {
      //   setSelectedPreference(preference.name)
      // }
      // DISABLED: Subcategory initialization
      const preference = preferences.find(p => p.name === selected || p.subcategories.includes(selected))
      if (preference) {
        setSelectedPreference(preference.name)
        if (preference.subcategories.includes(selected)) {
          setSelectedSubcategory(selected)
        }
      }
    }
  }, [formData.collect_preferences, preferences])

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

  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = isSelected ? "text-red-200" : "text-red-100/60"
    const iconSize = 24

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
      case "pokemon":
        return <MdCatchingPokemon size={iconSize} className={iconClass} />
      case "spaceship":
        return <PiFlyingSaucer size={iconSize} className={iconClass} />
      case "clapperboard":
        return <Clapperboard size={iconSize} className={iconClass} />
      case "warehouse":
        return <Warehouse size={iconSize} className={iconClass} />
      default:
        return <Target size={iconSize} className={iconClass} />
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <Target size={28} className="text-red-300" />
        <h2 className="text-2xl font-bold text-red-100">
          {formData.first_name ? `${formData.first_name}, ` : ""}
          {formData.is_returning_collector ? "#1 category you're focused on collecting" : "what do you want to collect?"}
        </h2>
      </motion.div>

      <motion.p variants={itemVariants} className="text-red-100/80 mb-6">
        Select one category that interests you
      </motion.p>

      {/* Categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {preferences.map((preference, index) => {
          const isSelected = selectedPreference === preference.name
          // DISABLED: Subcategory selection logic
          const hasSubcategories = preference.subcategories.length > 0
          const isSubcategorySelected = preference.subcategories.includes(selectedSubcategory || '')

          return (
            <motion.div
              // key={preference.name}
              // initial={{ scale: 0.9 }}
              // animate={{
              //   scale: 1,
              //   transition: { delay: index * 0.05 + 0.2 },
              // }}
              // whileHover={{ scale: 1.05 }} // Simplified hover effect
              className="relative rounded-lg overflow-visible"
            >
              <button
                onClick={() => handlePreferenceToggle(preference)}
                className={`w-full h-full p-6 text-center transition-all ${
                  isSelected
                    ? "bg-red-800/60 border-2 border-red-500"
                    : "bg-red-950/40 border-2 border-red-400/30 hover:border-red-400/60"
                } rounded-lg flex flex-col items-center justify-center gap-3`}
              >
                {renderIcon(preference.icon, isSelected)}
                <span className={`font-medium ${isSelected ? "text-red-200" : "text-red-100/80"}`}>
                  {preference.name}
                </span>
                {preference.name === "Studio Concepts" && (
                  <span className="text-red-100/80 text-xs px-0.5">
                    Mind Ya Business, Nunya Business, etc.
                  </span>
                )}
                {/* DISABLED: ChevronDown icon for subcategories */}
                {hasSubcategories && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${showSubcategories && isSelected ? 'rotate-180' : ''} text-red-100/60`}
                  />
                )}
              </button>

              {/* DISABLED: Subcategories dropdown (keeping for future use) */}
              <AnimatePresence>
                {isSelected && showSubcategories && hasSubcategories && ENABLE_SUBCATEGORIES && (
                  <motion.div
                    // initial={{ height: 0 }}
                    // animate={{ height: "auto" }}
                    // exit={{ height: 0 }}
                    // transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 mt-2 bg-red-950 border border-red-400/30 rounded-lg overflow-hidden shadow-xl pointer-events-auto backdrop-blur-sm z-50"
                  >
                    <p className="text-red-100/80 text-sm p-2 bg-red-950">More specific (optional)</p>
                    <hr className="border-red-400/30 mx-3" />
                    {preference.subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => handleSubcategorySelect(subcategory)}
                        className={`w-full p-3 text-left transition-colors bg-red-950 ${
                          selectedSubcategory === subcategory
                            ? "bg-red-800 text-red-200"
                            : "text-red-100/80 hover:bg-red-800 hover:text-red-200"
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 text-center text-red-100/80">
        {selectedPreference || selectedSubcategory ? (
          <div className="flex items-center justify-center gap-2 text-red-300">
            <Check size={18} />
            <span>Selected: {selectedSubcategory || selectedPreference}</span>
          </div>
        ) : (
          <span>Please select a category</span>
        )}
      </motion.div>
    </motion.div>
  )
}
