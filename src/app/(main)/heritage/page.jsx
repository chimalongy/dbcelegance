"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function Heritage() {
  let router = useRouter();

  const timeline = [
    {
      year: "1858",
      title: "FOUNDATION",
      description: "DBC ELEGANCE established in Paris by Dominique Bernard Château, specializing in exquisite leather goods and travel accessories for European aristocracy."
    },
    {
      year: "1890",
      title: "ROYAL PATRONAGE",
      description: "Appointed official supplier to several European royal courts, establishing our reputation for unparalleled quality and craftsmanship."
    },
    {
      year: "1925",
      title: "ART DECO INFLUENCE",
      description: "Embraced the Art Deco movement, introducing geometric patterns and bold designs that would become house signatures."
    },
    {
      year: "1955",
      title: "READY-TO-WEAR DEBUT",
      description: "Launched our first ready-to-wear collection, making DBC ELEGANCE elegance accessible to a wider audience while maintaining couture standards."
    },
    {
      year: "1980",
      title: "GLOBAL EXPANSION",
      description: "Opened flagship boutiques in New York, Tokyo, and London, establishing DBC ELEGANCE as a global luxury brand."
    },
    {
      year: "2005",
      title: "SUSTAINABILITY COMMITMENT",
      description: "Implemented comprehensive sustainability practices across all manufacturing processes and supply chains."
    },
    {
      year: "2020",
      title: "DIGITAL INNOVATION",
      description: "Launched virtual fashion shows and digital client experiences while preserving traditional craftsmanship."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 md:px-6 md:py-6 flex border-b border-gray-200">
        <div className="flex items-center cursor-pointer" onClick={router.back}>
          <MdKeyboardArrowLeft size={24} className="text-gray-700" />
          <p className="text-sm text-gray-700">Back</p>
        </div>
        <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
          <p className="tracking-wide lg:text-3xl">DBC ELEGANCE</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-[100px] lg:pt-[150px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-2xl font-light text-gray-900 tracking-wide mb-4">
            HERITAGE
          </h1>
          <div className="w-20 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            For over 160 years, DBC ELEGANCE has woven a tapestry of French elegance, 
            innovation, and uncompromising quality that continues to define luxury today.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
          
          {timeline.map((item, index) => (
            <div key={index} className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-8 md:ml-auto md:w-1/2' : 'md:pl-8 md:mr-auto md:w-1/2'}`}>
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-white z-10"></div>
              
              {/* Content */}
              <div className="ml-12 md:ml-0 bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-light text-gray-900 mr-4">{item.year}</span>
                  <span className="text-lg font-semibold text-gray-700">{item.title}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Founding Principles */}
        <div className="bg-gray-50 rounded-lg p-8 mt-16">
          <h2 className="text-xl font-light text-gray-900 mb-8 text-center">
            OUR FOUNDING PRINCIPLES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">QUALITY</h3>
              <p className="text-gray-600 text-sm">
                Uncompromising standards in materials, craftsmanship, and attention to detail
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">INNOVATION</h3>
              <p className="text-gray-600 text-sm">
                Continuous evolution while respecting traditional techniques and values
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ELEGANCE</h3>
              <p className="text-gray-600 text-sm">
                Timeless style that transcends trends and generations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}