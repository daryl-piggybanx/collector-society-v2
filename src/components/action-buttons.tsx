"use client"

import FuturisticButton from "@/components/ui/futuristic-button"
import { useMobile } from "@/hooks/use-mobile"
import { motion } from "motion/react"


export default function ActionButtons() {
  const isMobile = useMobile()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      className={`${isMobile ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 gap-3"} justify-center gap-4 pt-2`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* <FuturisticButton label="Drop Site" color="red" icon="rocket" href="https://www.piggybanxinc.com/" /> */}
      {/* <FuturisticButton label="Club House" color="red" icon="falling" href="https://www.piggybanx.com/" /> */}
      {/* <FuturisticButton label="Returning Collector Form" color="red" icon="scroll" href="/collector/og" /> */}
      <FuturisticButton label="New Collector Application" color="red" icon="user-plus" href="/collector/new" />
      <FuturisticButton label="OG Collector Profile" color="red" icon="user-check" href="/collector/update" />

      <FuturisticButton label="Discord Verification" color="red" icon="discord" href="/collector/discord" />

      {/* <FuturisticButton label="Wall-Piece Reservations" color="red" icon="wallpaper" href="/collector/reservation" /> */}
      <FuturisticButton label="1000% Waitlist" color="red" icon="wallpaper" href="/collector/reservation" /> 
    </motion.div>
  )
}