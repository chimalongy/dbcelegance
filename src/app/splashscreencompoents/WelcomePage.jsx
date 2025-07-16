'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
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
    const timer1 = setTimeout(() => setShowWelcome(true), 1000);
    const timer2 = setTimeout(() => setShowTitle(true), 1500);
    
    const fetchCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setCountry(data.country_name);
        setCountryCode(data.country_code);
      } catch (error) {
        console.error('Failed to fetch country:', error);
        setCountry('your country');
      } finally {
        setLoading(false);
        setTimeout(() => setShowContent(true), 2000);
      }
    };

    fetchCountry();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
   <div className="h-full bg-amber-50 flex items-center justify-center overflow-hidden">
      <div className="text-center w-full px-4 max-w-md">
        <AnimatePresence>
          {showWelcome && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{delay: 2.5, duration: 0.5 }}
              className="text-lg text-gray-600"
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
              transition={{ delay: 2.8, duration: 0.5, type: 'spring' }}
              className="text-4xl font-bold mb-8 text-gray-900"
            >
              DBC Elegance
            </motion.h1>
          )}
        </AnimatePresence>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-8"
          >
            <Loader />
          </motion.div>
        ) : (
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.5 }}
              >
                <p className="text-xl flex items-center justify-center gap-2 mb-2">
                  You are visiting from 
                </p>
                <motion.p 
                  className="flex items-center justify-center gap-2 text-gray-700"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 4.1, type: 'spring' }}
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
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* <AnimatePresence> */}
          {showContent && (
            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-6 py-3 bg-black text-white rounded-sm hover:bg-gray-800 transition-all font-medium shadow-lg"
                onClick={()=>{
                    router.push("/home")
                }}
            >
              Explore
            </motion.button>
          )}
        {/* </AnimatePresence> */}
      </div>
    </div>
  );
}