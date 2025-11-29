// app/legal/privacy-choices/page.js
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function PrivacyChoices() {
  const router = useRouter();
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Necessary cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    // In a real implementation, this would save to localStorage/cookies
    alert('Cookie preferences saved successfully!');
  };

  const acceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true
    });
    alert('All cookies accepted!');
  };

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
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-4">YOUR PRIVACY CHOICES & COOKIES</h1>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">MANAGE YOUR PRIVACY PREFERENCES</h2>
            <p className="mb-6">
              At DBC ELEGANCE, we respect your right to privacy. You can control how we use cookies 
              and similar technologies through the preferences below.
            </p>
          </section>

          {/* Cookie Preferences */}
          <section className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">COOKIE SETTINGS</h3>
            
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between p-4 bg-white rounded border">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Necessary Cookies</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Essential for the website to function properly. Cannot be disabled.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.necessary}
                    disabled
                    className="h-5 w-5 text-gray-600"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 bg-white rounded border">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                    className="h-5 w-5 text-gray-600"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 bg-white rounded border">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Used to deliver relevant advertisements and track campaign performance.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                    className="h-5 w-5 text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={savePreferences}
                className="bg-black text-white px-6 py-3 rounded font-light hover:bg-gray-800 transition-colors"
              >
                SAVE PREFERENCES
              </button>
              <button
                onClick={acceptAll}
                className="bg-gray-800 text-white px-6 py-3 rounded font-light hover:bg-gray-700 transition-colors"
              >
                ACCEPT ALL COOKIES
              </button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">TYPES OF COOKIES WE USE</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Strictly Necessary Cookies</h3>
                <p className="text-gray-600">
                  These cookies are essential for you to browse the website and use its features, 
                  such as accessing secure areas of the site. Without these cookies, services like 
                  shopping baskets and e-billing cannot be provided.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Performance Cookies</h3>
                <p className="text-gray-600">
                  These cookies collect information about how visitors use a website, for instance 
                  which pages visitors go to most often. These cookies don't collect information 
                  that identifies a visitor.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Functionality Cookies</h3>
                <p className="text-gray-600">
                  These cookies allow the website to remember choices you make and provide enhanced, 
                  more personal features. They may also be used to provide services you have asked for.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Targeting/Advertising Cookies</h3>
                <p className="text-gray-600">
                  These cookies are used to deliver adverts more relevant to you and your interests. 
                  They are also used to limit the number of times you see an advertisement as well as 
                  help measure the effectiveness of the advertising campaign.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">MANAGING COOKIES IN YOUR BROWSER</h2>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings preferences. 
              However, limiting the ability of websites to set cookies may worsen your overall user experience.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Browser-specific instructions:</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li><a href="#" className="text-blue-600 hover:underline">Google Chrome</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Safari</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CONTACT US</h2>
            <p className="mb-4">
              If you have any questions about our use of cookies or your privacy choices, 
              please contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Email: privacy@dbcelegance.com</p>
              <p>Phone: +33 (0)1 40 73 53 55</p>
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