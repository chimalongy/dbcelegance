// app/legal/ethics-compliance/page.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function EthicsCompliance() {
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
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-4">ETHICS & COMPLIANCE</h1>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">OUR COMMITMENT TO ETHICAL BUSINESS PRACTICES</h2>
            <p className="mb-4">
              At DBC ELEGANCE, we are committed to conducting business with the highest standards of 
              ethics, integrity, and compliance with all applicable laws and regulations. Our commitment 
              extends to all aspects of our operations and relationships.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CODE OF CONDUCT</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Integrity and Honesty</h3>
                <p className="text-gray-600">
                  We expect all employees, directors, and business partners to act with integrity 
                  and honesty in all business dealings.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Respect for Human Rights</h3>
                <p className="text-gray-600">
                  We are committed to respecting human rights and ensuring fair labor practices 
                  throughout our supply chain.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Anti-Corruption</h3>
                <p className="text-gray-600">
                  We have zero tolerance for bribery and corruption in any form. All business 
                  transactions must be transparent and properly recorded.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Confidentiality</h3>
                <p className="text-gray-600">
                  We protect confidential information belonging to the company, our customers, 
                  and business partners.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">SUPPLY CHAIN RESPONSIBILITY</h2>
            <p className="mb-4">
              We are committed to ethical sourcing and responsible supply chain management. 
              Our suppliers must adhere to our Supplier Code of Conduct, which includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Prohibition of forced labor and child labor</li>
              <li>Safe and healthy working conditions</li>
              <li>Fair wages and working hours</li>
              <li>Environmental protection standards</li>
              <li>Anti-corruption and bribery policies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">COMPLIANCE PROGRAM</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Training and Education</h3>
                <p className="text-gray-600">
                  All employees receive regular training on our Code of Conduct and compliance policies.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Monitoring and Auditing</h3>
                <p className="text-gray-600">
                  We conduct regular audits and monitoring to ensure compliance with our policies 
                  and applicable laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Reporting Mechanisms</h3>
                <p className="text-gray-600">
                  We provide confidential channels for reporting concerns about potential ethical 
                  or compliance violations.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">WHISTLEBLOWER PROTECTION</h2>
            <p className="mb-4">
              We encourage employees and third parties to report any concerns about unethical 
              behavior or compliance issues. We prohibit retaliation against anyone who reports 
              concerns in good faith.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Reporting Channels:</h4>
              <ul className="space-y-2">
                <li>Email: ethics@dbcelegance.com</li>
                <li>Hotline: +33 (0)1 40 73 53 56</li>
                <li>Online reporting portal: Available to employees</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ENVIRONMENTAL RESPONSIBILITY</h2>
            <p className="mb-4">
              We are committed to minimizing our environmental impact and promoting sustainable 
              practices throughout our operations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sustainable sourcing of materials</li>
              <li>Energy efficiency in our facilities</li>
              <li>Waste reduction and recycling programs</li>
              <li>Carbon footprint reduction initiatives</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CONTACT OUR ETHICS COMMITTEE</h2>
            <p className="mb-4">
              For questions or concerns about our ethics and compliance program, please contact:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Ethics & Compliance Committee</p>
              <p>Email: ethics@dbcelegance.com</p>
              <p>Phone: +33 (0)1 40 73 53 56</p>
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