// components/slides/SplashScreen.js
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Predefined particle positions and sizes to avoid hydration mismatch
const PARTICLES = [
  { width: 3.2, height: 4.0, left: 16.3, top: 19.3 },
  { width: 3.4, height: 5.1, left: 78.4, top: 8.1 },
  { width: 5.7, height: 5.9, left: 82.8, top: 87.9 },
  { width: 5.9, height: 2.9, left: 78.4, top: 69.0 },
  { width: 6.2, height: 3.3, left: 65.3, top: 74.8 }
];

export default function SplashScreen() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex justify-center items-center p-2 bg-black border-8 border-amber-500 h-[200px]">
          <p className="flex gap-1">
            <span className="text-amber-500 font-extrabold">DBC</span>
            <span className="text-white">Elegance</span>
          </p>
        </div>
      </div>
    );
  }

  return (
     <div className="h-screen flex justify-center items-center">
        <div className="flex justify-center items-center p-2 bg-black border-8 border-amber-500 h-[200px]">
          <p className="flex gap-1">
            <span className="text-amber-500 font-extrabold">DBC</span>
            <span className="text-white">Elegance</span>
          </p>
        </div>
      </div>
    // <div className="h-screen flex justify-center items-center">
    //   <motion.div
    //     className="flex justify-center items-center p-2 bg-black border-8 border-amber-500 h-[200px] relative overflow-hidden"
    //     initial="hidden"
    //     animate="visible"
    //     variants={containerVariants}
    //   >
    //     <motion.div
    //       className="absolute inset-0 border-8 border-transparent"
    //       animate={{
    //         borderColor: ['rgba(217, 119, 6, 0)', 'rgba(217, 119, 6, 0.3)', 'rgba(217, 119, 6, 0)'],
    //         scale: [1, 1.05, 1]
    //       }}
    //       transition={{
    //         duration: 2,
    //         repeat: Infinity,
    //         ease: "easeInOut"
    //       }}
    //     />

    //     <div className="absolute inset-0 shadow-[0_0_20px_5px_rgba(217,119,6,0.3)] opacity-0 hover:opacity-100 transition-opacity duration-300" />

    //     <motion.p className="flex gap-1 text-4xl md:text-5xl" variants={containerVariants}>
    //       {["D", "B", "C"].map((letter, index) => (
    //         <motion.span 
    //           key={index}
    //           className="text-amber-500 font-extrabold"
    //           variants={letterVariants}
    //           whileHover={{ y: -10 }}
    //         >
    //           {letter}
    //         </motion.span>
    //       ))}
    //       <motion.span 
    //         className="text-white"
    //         variants={letterVariants}
    //         whileHover={{ scale: 1.1 }}
    //       >
    //         Elegance
    //       </motion.span>
    //     </motion.p>

    //     {PARTICLES.map((particle, i) => (
    //       <motion.div
    //         key={i}
    //         className="absolute bg-amber-500 rounded-full"
    //         style={{
    //           width: `${particle.width}px`,
    //           height: `${particle.height}px`,
    //           left: `${particle.left}%`,
    //           top: `${particle.top}%`,
    //         }}
    //         animate={{
    //           y: [0, (Math.random() * 40) - 20],
    //           x: [0, (Math.random() * 40) - 20],
    //           opacity: [0.3, 0.8, 0.3],
    //         }}
    //         transition={{
    //           duration: Math.random() * 5 + 3,
    //           repeat: Infinity,
    //           repeatType: "reverse",
    //         }}
    //       />
    //     ))}
    //   </motion.div>
    // </div>
  );
}