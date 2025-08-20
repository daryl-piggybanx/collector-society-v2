// Motion React module declarations
declare module "motion/react" {
  import * as React from "react";

  // Basic motion component
  export const motion: any;
  
  // Hooks
  export const useScroll: any;
  export const useTransform: any;
  export const useMotionValueEvent: any;
  export const useInView: any;
  export const useMotionValue: any;
  export const useSpring: any;
  
  // Components
  export const AnimatePresence: any;
  
  // Types (with relaxed constraints)
  export interface Transition {
    [key: string]: any;
  }
  
  export interface ValueAnimationTransition {
    ease?: any;
    repeat?: any;
    times?: any;
    duration?: any;
    delay?: any;
  }
}
