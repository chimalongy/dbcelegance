// app/legal/privacy-notice/page.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function PrivacyNotice() {
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
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-4">PRIVACY NOTICE</h1>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">INTRODUCTION</h2>
            <p className="mb-4">
              At DBC ELEGANCE, we are committed to protecting and respecting your privacy. This Privacy 
              Notice explains how we collect, use, and protect your personal data when you use our 
              website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. DATA CONTROLLER</h2>
            <p className="mb-4">
              DBC ELEGANCE, with registered office at 27 rue Jean Goujon, 75008 Paris, France, 
              is the data controller for the personal data collected through our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. PERSONAL DATA WE COLLECT</h2>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">We may collect:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identity information (name, surname, title)</li>
                <li>Contact details (email address, phone number, postal address)</li>
                <li>Payment information (credit card details processed securely)</li>
                <li>Purchase history and preferences</li>
                <li>Browsing data and cookies</li>
                <li>Communication preferences</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. HOW WE USE YOUR DATA</h2>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">We use your personal data to:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and manage your orders</li>
                <li>Provide customer service and support</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our products and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. LEGAL BASIS FOR PROCESSING</h2>
            <p className="mb-4">
              We process your personal data based on:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your consent for marketing communications</li>
              <li>Performance of contract for order processing</li>
              <li>Legal obligations for compliance purposes</li>
              <li>Legitimate interests for improving our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. DATA SHARING</h2>
            <p className="mb-4">
              We may share your personal data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Payment service providers</li>
              <li>Delivery and logistics partners</li>
              <li>IT service providers</li>
              <li>Marketing agencies (with your consent)</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. INTERNATIONAL TRANSFERS</h2>
            <p className="mb-4">
              Your personal data may be transferred to countries outside the European Economic Area 
              (EEA). When we do so, we ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. DATA RETENTION</h2>
            <p className="mb-4">
              We retain your personal data only for as long as necessary to fulfill the purposes 
              for which it was collected, including for the purposes of satisfying any legal, 
              accounting, or reporting requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. YOUR RIGHTS</h2>
            <div className="mb-4">
              <p className="mb-4">Under GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Erase your personal data</li>
                <li>Restrict processing of your data</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. COOKIES</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your browsing experience, analyze 
              website traffic, and for advertising purposes. You can manage your cookie preferences 
              through our cookie settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. CONTACT US</h2>
            <p className="mb-4">
              For any questions about this Privacy Notice or to exercise your rights, please contact:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Data Protection Officer</p>
              <p>Email: privacy@dbcelegance.com</p>
              <p>Phone: +33 (0)1 40 73 53 55</p>
              <p>Address: 27 rue Jean Goujon, 75008 Paris, France</p>
            </div>
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