// app/legal/general-sales-conditions/page.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function GeneralSalesConditions() {
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
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-4">GENERAL SALES CONDITIONS</h1>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 1 - SCOPE</h2>
            <p className="mb-4">
              These General Conditions of Sale govern all sales concluded through the DBC ELEGANCE website 
              (www.dbcelegance.com) between DBC ELEGANCE and any consumer purchasing products for personal use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 2 - PRODUCTS</h2>
            <p className="mb-4">
              The products offered for sale are those described on the DBC ELEGANCE website on the date of 
              consultation by the customer. These descriptions may be modified at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 3 - PRICES</h2>
            <p className="mb-4">
              Prices are indicated in euros including all taxes. DBC ELEGANCE reserves the right to modify 
              its prices at any time, but the products will be invoiced on the basis of the prices in force 
              at the time the order is registered.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 4 - ORDERS</h2>
            <p className="mb-4">
              The customer places an order by selecting products and confirming the order through the 
              online ordering process. Order confirmation is subject to payment validation and product availability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 5 - PAYMENT</h2>
            <p className="mb-4">
              Payment is made immediately upon order confirmation using secure payment methods 
              (credit card, PayPal, etc.). The order will be processed only after payment confirmation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 6 - DELIVERY</h2>
            <p className="mb-4">
              Delivery times are indicated during the ordering process. DBC ELEGANCE will make every effort 
              to meet these deadlines but cannot be held responsible for delays due to carriers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 7 - RIGHT OF WITHDRAWAL</h2>
            <p className="mb-4">
              In accordance with legal provisions, the customer has a period of 30 days from receipt of 
              products to exercise their right of withdrawal, without having to justify reasons or pay penalties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 8 - RETURNS</h2>
            <p className="mb-4">
              Products must be returned in their original condition and packaging. Return costs are 
              the responsibility of the customer, except in cases of non-conformity or error in the order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 9 - WARRANTY</h2>
            <p className="mb-4">
              All products benefit from the legal warranty of conformity and the warranty against hidden 
              defects, in accordance with the provisions of the Consumer Code.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 10 - INTELLECTUAL PROPERTY</h2>
            <p className="mb-4">
              All elements of the DBC ELEGANCE website are and remain the exclusive intellectual property 
              of DBC ELEGANCE. No one is authorized to reproduce, exploit, or use for any purpose whatsoever 
              any of these elements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 11 - PERSONAL DATA</h2>
            <p className="mb-4">
              The processing of personal data is governed by our Privacy Policy, which is an integral 
              part of these General Conditions of Sale.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ARTICLE 12 - APPLICABLE LAW</h2>
            <p className="mb-4">
              These General Conditions of Sale are subject to French law. In the event of a dispute, 
              the French courts will have exclusive jurisdiction.
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