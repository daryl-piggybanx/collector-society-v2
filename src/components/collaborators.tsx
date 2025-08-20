"use client"

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, useMotionValue, useSpring } from "motion/react"

import { collaborators as mockCollaborators } from "@/lib/data"

import InfiniteMarquee from "@/components/marquee"

type CounterProps = {
    value: number;
    suffix?: string;
    duration?: number;
    className?: string;
}

function AnimatedCounter({ value, suffix = "", duration = 2, className = "" }: CounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const motionValue = useMotionValue(0);
    
    // Calculate spring config based on value to make animation duration proportional
    // Larger values will have lower stiffness, making them animate longer
    const getSpringConfig = (targetValue: number) => {
        // Base stiffness for small numbers (fast animation)
        const baseStiffness = 200;
        const baseDamping = 50;
        
        // Scale factor - larger numbers get proportionally slower
        const scaleFactor = Math.log10(Math.max(targetValue, 10)) / 2;
        
        return {
            stiffness: baseStiffness / scaleFactor,
            damping: baseDamping + (scaleFactor * 20),
        };
    };
    
    const springValue = useSpring(motionValue, getSpringConfig(value));

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <div ref={ref} className={className}>0{suffix}</div>;
}


export default function Collaborators() {
    return (
        <>
          {/* Three columns of text */}
          <motion.div className="grid grid-cols-3 gap-8 uppercase pt-20">
              <motion.div 
                  className="text-center text-black px-8 w-full max-w-4xl text-shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
              >
                  <AnimatedCounter 
                      value={30} 
                      suffix="+" 
                      className="text-6xl font-bold mb-4 font-sans text-shadow-lg"
                  />
                  <h2 className="text-2xl mb-6 opacity-80 text-shadow-lg">Wishes Granted</h2>
              </motion.div>
              <motion.div 
                  className="text-center text-black px-8 max-w-4xl text-shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
              >
                  <AnimatedCounter 
                      value={335000} 
                      suffix="+" 
                      className="text-6xl font-bold mb-4 font-sans text-shadow-lg"
                  />
                  <h2 className="text-2xl mb-6 opacity-80 text-shadow-lg">Charity Donations</h2>
              </motion.div>
              <motion.div 
                  className="text-center text-black px-8 max-w-4xl text-shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
              >
                  <AnimatedCounter 
                      value={200} 
                      suffix="+" 
                      className="text-6xl font-bold mb-4 font-sans text-shadow-lg"
                  />
                  <h2 className="text-2xl mb-6 opacity-80 text-shadow-lg">drops this year</h2>
              </motion.div>
          </motion.div>

          <InfiniteMarquee items={mockCollaborators} />
        </>
    )
}