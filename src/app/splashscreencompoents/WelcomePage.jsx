'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGeoDataStore } from '../lib/store/geoDataStore';
import { FiRefreshCw } from 'react-icons/fi';

export default function WelcomePage() {
  let geoData = useGeoDataStore((state) => state.geoData);
  let setGeoData = useGeoDataStore((state) => state.setGeoData);
  let clearGeoDataStore = useGeoDataStore((state) => state.clearGeoDataStore);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState(false);

  const fetchGeoData = async () => {
    setLoading(true);
    setError(false);
    try {
      // First API call: ipapi
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();

      let currencySymbol = null;
      let usdRate = null;
      let country_data;

      // Second API call: restcountries for currency symbol
      if (data.country_code) {
        try {
          const res2 = await fetch(
            `https://restcountries.com/v3.1/alpha/${data.country_code}`
          );
          const [countryData] = await res2.json();
          country_data = countryData
          console.log(countryData)
          const currencyInfo = countryData.currencies?.[data.currency];
          currencySymbol = currencyInfo?.symbol || null;
        } catch (e) {
          console.warn('Could not fetch currency symbol:', e);
        }
      }

      // Third API call: Fawaz Ahmed Currency API for USD → Local Rate
      if (data.currency) {
        try {
          const res3 = await fetch(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
          );
          const rateData = await res3.json();
          // usdRate = rateData.usd?.[data.currency.toLowerCase()] || null;
          // console.log(rateData)

          if (country_data?.continents[0]?.toLowerCase() === "africa") {
            usdRate = rateData.usd?.eur || null;
          }
          else {
            usdRate = rateData.usd?.[data.currency.toLowerCase()] || null;
          }
        } catch (e) {
          console.warn('Could not fetch exchange rate:', e);
        }
      }

      let payload = {
        ip: data.ip,
        country: data.country_name,
        country_code: data.country_code,
        city: data.city,
        region: data.region,
        postal: data.postal,
        time_zone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude,
        currency_code: data.currency,
        currency_name: data.currency_name,
        currency_symbol: currencySymbol,
        exchange_rate: usdRate,
        date: new Date().toLocaleDateString(),
        org: data.org,
        continent_name: country_data.continents[0],   // ✅ new field
      };

      if (payload.continent_name.toLowerCase() === "africa") {
        //get the exchange rate of euro here
        payload.currency_code = "EUR"
        payload.currency_name = "Euro"
        payload.currency_symbol="€"

      }



      setGeoData(payload)
    } catch (err) {
      console.error('Failed to fetch geo data:', err);
      setError(true);
    } finally {
      setLoading(false);
      setShowContent(true);
    }
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setShowWelcome(true), 500);
    const timer2 = setTimeout(() => setShowTitle(true), 1000);

    fetchGeoData();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="text-center w-full px-4 max-w-md">
        {/* Welcome Text */}
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

        {/* Title */}
        <AnimatePresence>
          {showTitle && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring' }}
              className="text-4xl font-serif font-light tracking-wide mb-8 text-gray-900"
            >
              DBC ELEGANCE
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Loader or Content */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-8 flex justify-center"
          >
            {/* <div className="w-12 h-12 border-2 border-amber-200 rounded-full"></div>
              <div className="w-12 h-12 border-2 border-transparent border-t-gray-700 rounded-full absolute top-0 left-0 animate-spin"></div> */}
            <div className="bg-white animate-pulse p-6 rounded">
              <img
                src="/images/dbclogo.png"
                alt="dbclogo"
                className="lg:w-[10%] w-[40%] mx-auto"
              />
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
                {error ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600 font-medium text-lg">
                      "Slow internet connection"
                    </p>
                    <button
                      onClick={fetchGeoData}
                      className=" mx-auto flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      <FiRefreshCw className="animate-spin" />
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-lg text-gray-600 mb-3">
                      You are visiting from:
                    </p>

                    {/* Country + Flag */}
                    <motion.div
                      className="flex items-center justify-center gap-2 text-gray-700 mb-6"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      {geoData.country_code && (
                        <motion.img
                          initial={{ rotate: -30, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          src={`https://flagcdn.com/24x18/${geoData.country_code.toLowerCase()}.png`}
                          alt={`${geoData.country} flag`}
                          className="inline-block w-6 h-auto"
                        />
                      )}
                      <span className="font-medium">{geoData.country}</span>
                    </motion.div>

                    {/* Extra Info */}
                    {/* <div className="text-sm text-gray-600 space-y-1 text-left">
                      <p>
                        <strong>IP:</strong> {geoData.ip}
                      </p>
                      {geoData.city && (
                        <p>
                          <strong>City:</strong> {geoData.city}
                        </p>
                      )}
                      {geoData.region && (
                        <p>
                          <strong>Region:</strong> {geoData.region}
                        </p>
                      )}
                      {geoData.postal && (
                        <p>
                          <strong>ZIP:</strong> {geoData.postal}
                        </p>
                      )}
                      {geoData.time_zone && (
                        <p>
                          <strong>Timezone:</strong> {geoData.time_zone}
                        </p>
                      )}
                      {geoData.currency_code && (
                        <p>
                          <strong>Currency:</strong> {geoData.currency_name} (
                          {geoData.currency_code}) {geoData.currency_symbol || ''}
                        </p>
                      )}
                      {geoData.exchange_rate && (
                        <p>
                          <strong>USD → {geoData.currency_code}:</strong> 1 USD ={' '}
                          {geoData.exchange_rate}{' '}
                          {geoData.currency_symbol || geoData.currency_code}
                        </p>
                      )}
                      <p>
                        <strong>Coordinates:</strong> {geoData.latitude},{' '}
                        {geoData.longitude}
                      </p>
                      {geoData.org && (
                        <p>
                          <strong>Network:</strong> {geoData.org}
                        </p>
                      )}
                      <p>
                        <strong>Date:</strong> {geoData.date}
                      </p>


                      {geoData.continent_name && (
                        <p>
                          <strong>Continent:</strong> {geoData.continent_name}

                        </p>
                      )}
                    </div> */}

                    {/* Explore Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.03, backgroundColor: '#111' }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 bg-black text-white rounded-sm transition-all font-light tracking-wide shadow-md mt-6"
                      onClick={() => {
                          router.push('/home');

                        console.log(geoData)
                      }}
                    >
                      Explore
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
