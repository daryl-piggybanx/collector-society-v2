"use client"

import { TbBrandDiscord } from "react-icons/tb";
import { useMobile } from "@/hooks/use-mobile"
import { FaInstagram } from "react-icons/fa";
import { motion } from "motion/react";

export default function SocialIcons() {
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
        className={`flex justify-center gap-4 flex-row`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <a href="https://discord.gg/piggybanx-1133508764474019870" target="_blank" rel="noopener noreferrer">
        <TbBrandDiscord size={48} className="text-gray-200/90" />
      </a>
      <a href="https://www.instagram.com/piggy_banx" target="_blank" rel="noopener noreferrer">
        <FaInstagram size={48} className="text-gray-200/90" />
      </a>
    </motion.div>
  )
}