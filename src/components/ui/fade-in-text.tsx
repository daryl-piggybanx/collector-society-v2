import { motion } from "motion/react";


export default function FadeInText({ children, className, duration = 0.4 }: { children: React.ReactNode, className?: string, duration?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: duration, ease: "easeIn" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
