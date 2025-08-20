"use client"

import { motion } from "motion/react"

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
import { Card } from "@/components/ui/card";

import Header from "@/components/header"

import SunriseBackground from "@/components/sunrise-background"
import Collaborators from "@/components/collaborators"

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);
const animation = gsap.timeline()


type SectionProps = {
  index: number;
}

const sections = [
    Affiliations,
    AcquireSection,
    BlockedSection,
    CommunitySection,
    FifthSection,
];



export default function Ethos() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sunriseRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.stack-section');
        
        if (cards.length === 0) return;
        
        const initCards = () => {
            const cardHeight = cards[0]?.offsetHeight || window.innerHeight;
            console.log("initCards()", cardHeight);

            // Clear any existing animations            
            gsap.killTweensOf(cards);
            
            // Set initial positions - stack cards on top of each other with offsets
            cards.forEach((card, index) => {
                if (index > 0) {
                    // Increment y value of each card by cardHeight (stack them)
                    gsap.set(card, { y: index * cardHeight });
                }
            });
            
            // Create the main timeline for the stacking animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => `+=${cards.length * cardHeight}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    // markers: true, // Remove in production
                }
            });
            
            // Animate each card back to 0 (for stacking effect)
            cards.forEach((card, index) => {
                if (index > 0) {
                    tl.to(card, {
                        y: 0,
                        duration: index * 0.5,
                        ease: "none"
                    }, 0); // All animations start at the same time
                }
            });

            // Fade out SunriseBackground when stacked sections come into view
            if (sunriseRef.current) {
                gsap.to(sunriseRef.current, {
                    opacity: 0,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom", // When container starts entering viewport
                        end: "top top", // When container reaches top of viewport
                        scrub: true,
                        // markers: true, // Remove in production
                    }
                });
            }
        };
        
        // Initialize cards
        initCards();
        
        // Reinitialize on resize
        const handleResize = () => {
            // ScrollTrigger.refresh();
            // initCards();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, { scope: containerRef });

    return (
        <>
          <Header />
            {/* Header section that scrolls normally */}
            {/* <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-4">Stacked Cards Demo</h1>
                    <p className="text-xl opacity-80">Scroll down to see the stacking animation</p>
                    <div className="mt-8 animate-bounce">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div> */}
            <div ref={sunriseRef}>
                <SunriseBackground />
            </div>
            <div className="h-[700vh]" />
            

            {/* Stacked sections container */}
            <div ref={containerRef} className="relative border-none bg-transparent">
                {sections.map((Section, index) => (
                    <Card key={index} className="border-none shadow-none">
                        <Section index={index} />
                    </Card>
                ))}
            </div>
            <div className="h-dvh"/>
        </>
    );
}



function Affiliations({ index }: SectionProps) {
    return (
        <section
            className={`stack-section h-screen flex flex-col items-center justify-center absolute top-0 left-0 w-full bg-gradient-to-b from-[#242426]/0 via-10% to-white to-30%`}
            style={{ 
                zIndex: index + 1,
            }}
        >
            <Collaborators />

        </section>
    )
}

function AcquireSection({ index }: SectionProps) {
    return (
        <section
            className={`stack-section h-screen flex items-center justify-center absolute top-0 left-0 w-full bg-gradient-to-b from-black from-10% via-black/90 via-30% to-black to-90%`}
            style={{ 
                zIndex: index + 1,
            }}
        >
            <motion.div className="flex text-white px-8 max-w-4xl">
                <div className="flex text-white flex-col items-center justify-center relative">
                    <motion.p 
                        initial={{ opacity: 0, x: -200 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        className="text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-wrap z-20"
                    >
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                    </motion.p>
                    {/* <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" 
                    /> */}
                </div>
                
                <div 
                    className="flex flex-col items-center justify-center relative"
                >
                    <motion.h1 
                        initial={{ opacity: 0}}
                        whileInView={{ opacity: 1}}
                        transition={{ duration: 1, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-6xl font-bold mb-4 font-sans absolute top-[-3rem] left-0 uppercase"
                    >Acquire</motion.h1>
                    <motion.img 
                        initial={{ translateX: 100}}
                        whileInView={{ translateX: 0}}
                        transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        src="/assets/acquire-cards.png" alt="Acquire" width={400} height={600} className="w-full h-full object-contain" />
                </div>
            </motion.div>
        </section>
    )
}


function BlockedSection({ index }: SectionProps) {
    return (
        <section
        className={`stack-section h-screen flex items-center justify-center absolute top-0 left-0 w-full bg-gradient-to-b from-black/100 from-20% via-black via-30% to-black to-90%`}
            style={{ 
                zIndex: index + 1,
            }}
        >
            <motion.div className="flex text-white px-8 max-w-4xl">
                <div 
                    className="flex flex-col items-center justify-center relative"
                >
                    <motion.h1 
                        initial={{ opacity: 0}}
                        whileInView={{ opacity: 1}}
                        transition={{ duration: 1, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-6xl font-bold mb-4 font-sans absolute top-[-3rem] left-0 uppercase"
                    >Blocked</motion.h1>
                    <motion.img 
                        initial={{ translateX: -100}}
                        whileInView={{ translateX: 0}}
                        transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        src="/assets/acquire-cards.png" alt="Acquire" width={400} height={600} className="w-full h-full object-contain" />
                </div>

                <div className="flex text-white flex-col items-center justify-center relative">
                    <motion.p 
                        initial={{ opacity: 0, x: 200 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        className="text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-wrap z-20 text-right"
                    >
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                    </motion.p>
                </div>
                
            </motion.div>
        </section>
    )
}

function CommunitySection({ index }: SectionProps) {
    return (
        <section
        className={`stack-section h-screen flex items-center justify-center absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 from-20% via-black via-30% to-black to-90%`}
            style={{ 
                zIndex: index + 1,
            }}
        >
            <motion.div className="flex text-white px-8 max-w-4xl">
                <div className="flex text-white flex-col items-center justify-center relative">
                    <motion.p 
                        initial={{ opacity: 0, x: -200 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        className="text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-wrap z-20"
                    >
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                        lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium
                    </motion.p>
                </div>

                <div 
                    className="flex flex-col items-center justify-center relative"
                >
                    <motion.h1 
                        initial={{ opacity: 0}}
                        whileInView={{ opacity: 1}}
                        transition={{ duration: 1, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-6xl font-bold mb-4 font-sans absolute top-[-3rem] left-0 uppercase"
                    >Community</motion.h1>
                    <motion.img 
                        initial={{ translateX: 100}}
                        whileInView={{ translateX: 0}}
                        transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        src="/assets/acquire-cards.png" alt="Acquire" width={400} height={600} className="w-full h-full object-contain" />
                </div>
                
            </motion.div>
        </section>
    )
}

function FifthSection({ index }: SectionProps) {
    return (
        <section
            className={`stack-section h-screen flex items-center justify-center absolute top-0 left-0 w-full bg-gradient-to-br from-indigo-600 to-blue-700`}
            style={{ 
                zIndex: index + 1,
            }}
        >
            <div className="text-center text-white px-8 max-w-4xl">
                <h1 className="text-6xl font-bold mb-4 font-sans">Contact</h1>
                <h2 className="text-2xl mb-6 opacity-80">Final Section</h2>
                <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-8">fifth section for stacking animation.</p>
                <div className="inline-block px-6 py-3 border-2 border-white/30 rounded-full text-sm tracking-wider">
                    Section 5 of 5
                </div>
            </div>
        </section>
    )
}


