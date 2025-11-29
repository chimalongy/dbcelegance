// app/legal/legal-terms/page.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function LegalTerms() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 md:px-6 md:py-6 flex border-b border-gray-200">
        <div className="flex items-center cursor-pointer" onClick={() => router.back()}>
          <MdKeyboardArrowLeft size={24} className="text-gray-700" />
          <p className="text-sm text-gray-700">Back</p>
        </div>
        <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
          <p className="tracking-wide lg:text-3xl">DBC ELEGANCE</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-[100px] lg:pt-[150px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-4">LEGAL TERMS</h1>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. LEGAL INFORMATION</h2>
            <p className="mb-4">
              The website www.dbcelegance.com is published by:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold">DBC ELEGANCE</p>
              <p>Société par Actions Simplifiée with capital of €10,000,000</p>
              <p>RCS Paris 123 456 789</p>
              <p>VAT number: FR 12 123456789</p>
              <p>Headquarters: 27 rue Jean Goujon, 75008 Paris, France</p>
              <p>Phone: +33 (0)1 40 73 53 55</p>
              <p>Email: legal@dbcelegance.com</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. PUBLICATION DIRECTOR</h2>
            <p className="mb-4">
              Mr. Jean-Luc Dubois<br />
              Chief Executive Officer
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. HOSTING</h2>
            <p className="mb-4">
              The website is hosted by:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold">Vercel Inc.</p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789</p>
              <p>United States</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. INTELLECTUAL PROPERTY</h2>
            <p className="mb-4">
              The entire content of the DBC ELEGANCE website, including but not limited to texts, graphics, 
              logos, icons, images, audio clips, digital downloads, and software, is the property of 
              DBC ELEGANCE or its content suppliers and is protected by international copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. TRADEMARKS</h2>
            <p className="mb-4">
              DBC ELEGANCE trademarks and logos displayed on the site are registered trademarks of 
              DBC ELEGANCE. Any unauthorized use of these trademarks is strictly prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. LIMITATION OF LIABILITY</h2>
            <p className="mb-4">
              DBC ELEGANCE shall not be held liable for any indirect damages resulting from the use 
              of the website or the inability to use the website, including but not limited to loss 
              of profits, loss of data, or business interruption.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. LINKS TO THIRD-PARTY SITES</h2>
            <p className="mb-4">
              The DBC ELEGANCE website may contain links to third-party websites. DBC ELEGANCE has 
              no control over and assumes no responsibility for the content, privacy policies, or 
              practices of any third-party sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. GOVERNING LAW</h2>
            <p className="mb-4">
              These legal terms are governed by and construed in accordance with French law. Any 
              disputes relating to these terms shall be subject to the exclusive jurisdiction of 
              the courts of Paris.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}