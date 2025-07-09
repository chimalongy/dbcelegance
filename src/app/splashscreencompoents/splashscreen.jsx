// components/slides/SplashScreen.js
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

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
      <div className=" h-screen flex justify-center items-center">
        <Image
        src="/images/dbclogo.png"
        alt="dbclogo"
        width={200}
        height={200}
        />
      </div>
    );
  }

  return (
     <div className=" h-screen flex justify-center items-center">
         <Image
        src="/images/dbclogo.png"
        alt="dbclogo"
        width={200}
        height={200}
        />
      </div>
  
  );
}