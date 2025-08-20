"use client"

import { DomainButton, DomainButtonV2 } from "@/components/ui/domain-button";
import { useMobile } from "@/hooks/use-mobile";
import { motion } from "motion/react";

export default function RedirectButtons() {
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
        <>
      <motion.div
        className={`${isMobile ? "flex flex-row flex-wrap" : "flex flex-row flex-wrap"} justify-center gap-8 m-0`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <DomainButton label="Drop Site" icon="falling" href="https://www.piggybanxinc.com/" />
        <DomainButton label="Club House" icon="home" href="https://www.piggybanx.com/" />
      </motion.div>

      {/* <motion.div
        className={`${isMobile ? "flex flex-row flex-wrap" : "flex flex-row flex-wrap"} justify-center gap-8 pt-6`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <DomainButtonV2 label="Drop Site" icon="falling" href="https://www.piggybanxinc.com/" />
        <DomainButtonV2 label="Club House" icon="home" href="https://www.piggybanx.com/" />
      </motion.div> */}
      </>
    )
}