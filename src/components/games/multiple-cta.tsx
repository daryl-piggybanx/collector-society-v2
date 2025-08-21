"use client"

import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import type { GameMode } from "~/lib/game/data"
import { gameModes } from "~/lib/game/data"

export function MultipleCTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-mono-light/20 text-mono-light border-mono-light/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy transition-all duration-300"
      case "Medium":
        return "bg-mono-mid/20 text-mono-mid border-mono-mid/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy transition-all duration-300"
      case "Hard":
        return "bg-mono-heavy/20 text-mono-heavy border-mono-heavy/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy transition-all duration-300"
      case "Legendary":
        return "bg-mono-light/20 text-mono-light border-mono-light/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy transition-all duration-300"
      default:
        return "bg-mono-mid/20 text-mono-mid border-mono-mid/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy transition-all duration-300"
    }
  }

  return (
    <section id="game" className="py-20 px-4 sm:px-6 lg:px-8 bg-mono-heavy">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-4xl md:text-5xl font-black mb-4 text-mono-light uppercase"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Collectible <span className="text-mono-mid">Art</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-mono-mid" style={{ fontFamily: "system-ui, sans-serif" }}>
            From cooperative raids to competitive crucible matches, discover the activities that define your Guardian's
            journey.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {gameModes.map((mode) => (
            <motion.div
              key={mode.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden group transition-all duration-300 bg-mono-heavy border-mono-mid hover:bg-mono-light hover:border-mono-heavy">
                <div className="relative">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/astro-boy_banner-nfWFnfklVAvUjVzjBfQaCHvRMhKwML.png"
                    alt={mode.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mono-heavy via-mono-heavy/60 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-mono-mid/20 text-mono-mid border-mono-mid/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy transition-all duration-300">{mode.playerCount}</Badge>
                    <Badge className={getDifficultyColor(mode.difficulty)}>{mode.difficulty}</Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle
                    className="text-2xl font-bold text-mono-light group-hover:text-mono-heavy transition-all duration-300"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {mode.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription
                    className="text-base leading-relaxed text-mono-mid group-hover:text-mono-heavy transition-all duration-300"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {mode.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
