import { motion, useScroll, useTransform, useMotionValueEvent, useInView } from "motion/react"
import { useRef } from "react"

import FadeInText from "~/components/ui/fade-in-text"

import brutalKnight from "~/assets/brutal/abstract-brutal-knight.png"
import brutalKnightRemoveBG from "~/assets/brutal/abstract-brutal-knight-removebg.png"
import brutalKnightMidRemoveBG from "~/assets/brutal/abstract-brutal-knight_mid-removebg.png"

import brutalCrown from "~/assets/brutal/abstract-brutal-crown.png"
import logo from "~/assets/logo-black.png"
import brutalSwordPattern from "~/assets/brutal/brutal-sword-pattern.png"
export default function BrutalistGallery() {
    const { scrollYProgress } = useScroll()
    const textRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)
    const isImageInView = useInView(imageRef, { once: false, amount: 0.3 })
    const isTextInView = useInView(textRef, { once: false, amount: 0.3 })
    

    useMotionValueEvent(scrollYProgress, "change", (latestValue: number) => {
    })

  return (
    <section className="p-8 border-b border-border overflow-visible">
      <div className="grid grid-cols-12 gap-4 min-h-screen">
        {/* Large artwork placeholder */}
        <motion.div className="col-span-6 row-span-3 bg-muted border border-border overflow-hidden relative">
          {/* <img
            src={brutalKnightRemoveBG}
            alt="BRUTALIST KNIGHT"
            width={1000}
            height={1000}
            className="w-full opacity-20 h-full object-contain z-20 absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 translate-x-4"
          /> */}
          <img
            src={brutalKnightRemoveBG}
            alt="BRUTALIST KNIGHT"
            width={1000}
            height={1000}
            className="w-full h-full object-cover filter grayscale z-30 relative"
          />
        </motion.div>

        {/* Scattered text elements */}
        <div className="col-span-2 flex items-center">
          <div className="text-xl font-extrabold font-mono transform -rotate-90">PIGGYBANX</div>
        </div>

        <div className="col-span-4 flex items-end relative overflow-visible">
        <FadeInText
          className="text-3xl font-mono text-brutal-mid/70 absolute">
            NOSTALGIA
            <br />
            MADE
            <br />
            TANGIBLE
          </FadeInText>
          <div className="text-2xl font-mono font-black z-10 top-50% left-50% -translate-x-1/2 -translate-y-1/2">
            NOSTALGIA
            <br />
            MADE
            <br />
            TANGIBLE
          </div>
        </div>

        {/* Medium artwork */}
        <div className="col-span-3 row-span-2 bg-muted border border-border">
          <img
            src={brutalSwordPattern}
            alt="BRUTAL SWORD PATTERN"
            width={500}
            height={500}
            className="w-full h-full object-cover filter grayscale"
          />
        </div>

        <div className="col-span-3 flex items-center justify-center relative pr-10">
          <div className="text-center text-md font-mono absolute z-10">
            GUARANTEED
            <br />
            ACCESS TO 2
            <br />
            EXCLUSIVE DROPS
            <br />
            PER MONTH FOR THE
            <br />
            NEXT 12 MONTHS
          </div>
          <FadeInText
          className="text-right text-4xl font-bold text-brutal-mid/50 font-mono top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 max-w-1/2">
            PRIVATE WEBSITE
            <br />
            PORTAL ACCESS
          </FadeInText>
        </div>

        {/* Small artworks */}
        <div className="col-span-2 bg-muted border border-border">
          <img
            src={brutalCrown}
            alt="BRUTALIST CROWN"
            width={500}
            height={500}
            className="w-full h-full object-contain filter grayscale"
          />
        </div>

        <div className="col-span-2 bg-muted border border-border relative">
          <img
            src={logo}
            alt="LINEAR 04"
            width={500}
            height={500}
            className="w-full h-full object-cover filter grayscale absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="col-span-2 flex items-center relative">
          <div className="text-lg font-mono font-black z-10 absolute">
            EARLY ACCESS TO
            <br />
            MERCH, PRODUCT
            <br />
            SAMPLES, AND MORE
          </div>
          <FadeInText
            duration={0.8}
            className="text-lg font-mono font-black text-brutal-mid/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            EARLY ACCESS TO
            <br />
            MERCH, PRODUCT
            <br />
            SAMPLES, AND MORE
          </FadeInText>
        </div>

        {/* background image*/}
        <div className="col-span-2 bg-muted border-4 border-r-transparent border-l-transparent">
          <img
            src={brutalSwordPattern}
            alt="BRUTAL SWORD PATTERN"
            width={500}
            height={500}
            className="w-full h-full object-contain filter grayscale opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Text blocks scattered */}
        <div className="col-span-4 flex items-center relative">
          <div className="text-md sm:text-4xl text-black font-mono leading-tight uppercase z-10 bottom-1/2 right-1/4 translate-x-1/4 translate-y-1/2">
            rotating allocation will guarantee every knight receives 1 of each of the 24 variations including 1 alpha and 1 diamond
          </div>
        </div>

        <div ref={imageRef} className="col-span-2 bg-muted border border-border">
          {/* <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.4 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={brutalKnightMidRemoveBG}
            alt="BRUTALIST KNIGHT"
            width={500}
            height={500}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 w-full h-full object-contain filter grayscale opacity-50 rotate-y-180 scale-x-[-1] -translate-x-4"
          /> */}
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageInView ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeIn" }}
            src={brutalKnightMidRemoveBG}
            alt="BRUTALIST KNIGHT"
            width={500}
            height={500}
            className="w-full h-full object-contain filter grayscale opacity-50 rotate-y-180 scale-x-[-1]"
          />
        </div>
      </div>
    </section>
  )
}
