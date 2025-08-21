"use client"

import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import type { NewsItem } from "~/lib/game/data"
import { newsItems } from "~/lib/game/data"

export function Collage() {
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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Expansion":
        return "bg-mono-light/20 text-mono-light border-mono-light/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy"
      case "Season":
        return "bg-mono-mid/20 text-mono-mid border-mono-mid/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy"
      case "PvP":
        return "bg-mono-heavy/20 text-mono-heavy border-mono-heavy/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy"
      default:
        return "bg-mono-mid/20 text-mono-mid border-mono-mid/30 group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy"
    }
  }

  return (
    <section id="news" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <h2
            className="text-4xl md:text-5xl font-black mb-4 text-mono-light"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            LATEST <span className="text-mono-mid">NEWS</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-mono-mid" style={{ fontFamily: "system-ui, sans-serif" }}>
            Stay up to date with the latest developments, seasonal content, and community events in the Destiny
            universe.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
            >
              <Card
                className="overflow-hidden group h-full transition-all duration-300 hover:opacity-90 bg-mono-heavy border-mono-mid"
              >
                <div className="relative">
                  <img
                    src="/assets/steve-aoki_banner.png"
                    alt={item.title}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale ${
                      index === 0 ? "h-64 lg:h-80" : "h-48"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mono-heavy/80 to-transparent scale-105" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="bg-mono-heavy/80 text-mono-light group-hover:bg-mono-light group-hover:text-mono-heavy group-hover:border-mono-heavy">
                      {new Date(item.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle
                    className={`font-bold text-mono-light ${index === 0 ? "text-2xl lg:text-3xl" : "text-xl"}`}
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardDescription
                    className={`leading-relaxed mb-4 text-mono-mid ${index === 0 ? "text-lg" : "text-base"}`}
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {item.excerpt}
                  </CardDescription>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent hover:opacity-80 transition-opacity border-mono-mid text-mono-mid"
                    >
                      Read More
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: false }}
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent hover:opacity-80 transition-opacity border-mono-mid text-mono-mid"
          >
            View All News
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
