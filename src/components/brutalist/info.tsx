import { motion, useInView, useScroll } from "motion/react"
import { useRef } from "react"
import FadeInText from "~/components/ui/fade-in-text"

export default function BrutalistInfo() {
  const { scrollYProgress } = useScroll()
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(textRef, { once: false, amount: 0.3 })

  return (
    <section className="p-8 border-b border-border">
      <div className="grid grid-cols-8 gap-8 min-h-96">
        <div className="col-span-2">
          <div className="text-xs font-mono mb-4">LOCATION</div>
          <div className="text-sm font-mono">
            WAREHOUSE DISTRICT
            <br />
            BUILDING 47
            <br />
            FLOOR 3
            <br />
            UNIT 301
          </div>
        </div>

        <div className="col-span-2 flex items-center">
          <div className="text-4xl font-mono font-black transform -rotate-12 uppercase">PRIVATE DISCORD <br /> CHANNEL</div>
        </div>

        <div className="col-span-2 relative">
          <FadeInText
            duration={0.8}
            className="text-xl font-mono mt-8 font-bold text-brutal-mid/80 absolute">
            END OF YEAR DINNER
            <br />
            <span className="text-xs">AT UNDISCLOSED</span>
            <br />
            <span className="text-xs">LOCATION</span>
          </FadeInText>
          <div className="text-sm font-mono mt-8 absolute z-10 bottom-1/3 translate-y-1/2">
            END OF YEAR DINNER
            <br />
            <span className="text-xs">AT UNDISCLOSED</span>
            <br />
            <span className="text-xs">LOCATION</span>
          </div>
        </div>

        <div className="col-span-2 flex items-end">
          <div className="text-xs font-mono">CONCIERGE@PIGGYBANXINC.COM</div>
        </div>

        <div className="col-span-3 flex items-center">
          <div className="text-md sm:text-2xl font-mono text-black/80 uppercase">
            have your "player name" memorialized at the knight's table
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-center">
          <div className="text-2xl font-mono font-black">
            VOTING RIGHTS
            <br />
            ON
            <br />
            EXTRA
            <br />
            ALLOCATIONS
          </div>
        </div>

        <div className="col-span-3 flex items-end relative">
          <div className="text-md sm:text-4xl z-10 front-bold font-mono text-black uppercase absolute text-wrap min-w-[300px]">
            First custom 3D Printed display and cases from the studio
          </div>
          <FadeInText
            duration={0.8}
            className="text-md sm:text-3xl font-mono text-brutal-mid/60 uppercase -translate-y-1/2">
            First custom 3D Printed display and cases from the studio
          </FadeInText>
        </div>
      </div>
    </section>
  )
}
