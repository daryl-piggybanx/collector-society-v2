"use client"

import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import type { Guardian } from "~/lib/game/data"
import { guardianClasses } from "~/lib/game/data"

export function Cards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-bl from-mono-light/50 from-10% via-mono-heavy/60 via-30% to-heavy to-90%">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-4xl md:text-5xl font-black mb-4 text-mono-light"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            DEFINE YOUR <span className="text-mono-mid text-shadow-lg text-shadow-black">COLLECTION</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-mono-mid" style={{ fontFamily: "system-ui, sans-serif" }}>
            Choose from three unique art pieces, each with their own abilities, playstyles, and role in the fight
            against the Darkness.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          {guardianClasses.map((guardian, index) => (
            <motion.div
              key={guardian.id}
              variants={itemVariants}
              whileHover={{ y: -15, rotateY: 5 }}
              transition={{ duration: 0.4 }}
              style={{ perspective: 1000 }}
            >
              <Card className="overflow-hidden group h-full transition-all duration-300 hover:opacity-90 bg-mono-heavy border-mono-mid">
                <div className="relative">
                  <img
                    src="/assets/astro-boy_banner.png"
                    alt={guardian.className}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mono-heavy via-mono-heavy/60 to-transparent scale-110" />
                  <motion.div
                    className="absolute top-4 left-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Badge className="text-lg px-3 py-1 bg-mono-light/20 text-mono-light border-mono-light/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy">
                      {guardian.className}
                    </Badge>
                  </motion.div>
                </div>

                <CardHeader>
                  <CardTitle
                    className="text-2xl font-bold text-mono-light"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {guardian.className}
                  </CardTitle>
                  <CardDescription
                    className="text-base leading-relaxed text-mono-mid"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {guardian.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold mb-3 text-mono-light">Signature Abilities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {guardian.abilities.map((ability, abilityIndex) => (
                        <motion.div
                          key={ability}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.2 + abilityIndex * 0.1 }}
                        >
                          <Badge variant="outline" className="text-xs border-mono-mid text-mono-mid group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy">
                            {ability}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
