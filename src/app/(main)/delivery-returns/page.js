"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function DeliveryReturns() {
      let router = useRouter();
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 md:px-6 md:py-6 flex border-b border-gray-200 ">
        <div className="flex items-center cursor-pointer" onClick={router.back}>
          <MdKeyboardArrowLeft size={24} className="text-gray-700" />
          <p className="text-sm text-gray-700">Back</p>
        </div>
        <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
          <p className="tracking-wide lg:text-3xl">DBC ELEGANCE</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto  py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-light text-gray-900 tracking-wide mb-8 text-center">
          DELIVERY AND RETURNS
        </h1>

        <div className="space-y-8">
          {/* Delivery Section */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-light text-gray-900 mb-6">
              DELIVERY INFORMATION
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                We offer worldwide shipping with various delivery options to
                ensure your DBC ELEGANCE pieces arrive safely and promptly.
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Delivery Options
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-medium text-gray-900 mr-2">
                      Standard Delivery:
                    </span>
                    <span>3-5 business days - Complimentary</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-gray-900 mr-2">
                      Express Delivery:
                    </span>
                    <span>1-2 business days - $25</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-gray-900 mr-2">
                      Same Day Delivery:
                    </span>
                    <span>Available in select metropolitan areas - $50</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  International Shipping
                </h3>
                <p>
                  We ship to over 100 countries worldwide. Delivery times vary
                  by destination, typically ranging from 5-10 business days.
                  Customs duties and taxes may apply and are the responsibility
                  of the recipient.
                </p>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              RETURNS & EXCHANGES
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                We want you to be completely satisfied with your DBC ELEGANCE
                purchase. If you're not happy with your order, we're here to
                help.
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Return Policy
                </h3>
                <ul className="space-y-3">
                  <li>• Returns are accepted within 30 days of purchase</li>
                  <li>
                    • Items must be in original condition with tags attached
                  </li>
                  <li>
                    • Original packaging and documentation must be included
                  </li>
                  <li>• Return shipping is complimentary</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  How to Return
                </h3>
                <ol className="space-y-3 list-decimal list-inside">
                  <li>Log into your account and visit "My Orders"</li>
                  <li>Select the item(s) you wish to return</li>
                  <li>Print the prepaid shipping label</li>
                  <li>
                    Package your items securely and drop at any UPS location
                  </li>
                </ol>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Important Notes
                </h4>
                <p className="text-sm">
                  Customized items, fine jewelry, and intimate apparel cannot be
                  returned for hygiene reasons. Sale items are eligible for
                  exchange or store credit only.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              NEED HELP?
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Our Client Service team is available to assist you with any
                delivery or return inquiries.
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Phone:</strong> +1 (888) 555-0150
                </p>
                <p>
                  <strong>Email:</strong> clientservices@dbcelegance.com
                </p>
                <p>
                  <strong>Hours:</strong> Monday-Friday, 9AM-9PM EST
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
