'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Initial animation sequence
    const timer1 = setTimeout(() => setShowWelcome(true), 500);
    const timer2 = setTimeout(() => setShowTitle(true), 1000);
    
    const fetchCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setCountry(data.country_name);
        setCountryCode(data.country_code);
      } catch (error) {
        console.error('Failed to fetch country:', error);
        setCountry('your region');
      } finally {
        setLoading(false);
        setTimeout(() => setShowContent(true), 1500);
      }
    };

    fetchCountry();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="h-screen bg-amber-50 flex items-center justify-center overflow-hidden">
      <div className="text-center w-full px-4 max-w-md">
        <AnimatePresence>
          {showWelcome && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-gray-600 mb-2"
            >
              Welcome to
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTitle && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring' }}
              className="text-4xl font-serif font-light tracking-wide mb-8 text-gray-900"
            >
              DBC Elegance
            </motion.h1>
          )}
        </AnimatePresence>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-8 flex justify-center"
          >
            {/* Elegant Loader */}
            <div className="relative">
              <div className="w-12 h-12 border-2 border-amber-200 rounded-full"></div>
              <div className="w-12 h-12 border-2 border-transparent border-t-gray-700 rounded-full absolute top-0 left-0 animate-spin"></div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg text-gray-600 mb-3">
                  You are visiting from 
                </p>
                <motion.div 
                  className="flex items-center justify-center gap-2 text-gray-700 mb-6"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  {countryCode && (
                    <motion.img
                      initial={{ rotate: -30, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                      alt={`${country} flag`}
                      className="inline-block w-6 h-auto"
                    />
                  )}
                  <span className="font-medium">{country}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {showContent && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.03, backgroundColor: "#111" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-black text-white rounded-sm transition-all font-light tracking-wide shadow-md"
              onClick={() => {
                router.push("/home");
              }}
            >
              Enter Store
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}