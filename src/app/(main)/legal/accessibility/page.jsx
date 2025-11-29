// app/legal/accessibility/page.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function Accessibility() {
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
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-4">ACCESSIBILITY</h1>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">OUR COMMITMENT TO ACCESSIBILITY</h2>
            <p className="mb-4">
              DBC ELEGANCE is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant 
              accessibility standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CONFORMANCE STATUS</h2>
            <p className="mb-4">
              The DBC ELEGANCE website partially conforms to the Web Content Accessibility Guidelines 
              (WCAG) 2.1 Level AA. Partially conformant means that some parts of the content do not 
              fully conform to the accessibility standard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ACCESSIBILITY FEATURES</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Keyboard Navigation</h3>
                <p className="text-gray-600">
                  Our website can be navigated using a keyboard alone. Use Tab to navigate forward, 
                  Shift+Tab to navigate backward, and Enter to activate links and buttons.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Screen Reader Compatibility</h3>
                <p className="text-gray-600">
                  We have implemented ARIA landmarks and other semantic HTML to improve compatibility 
                  with screen readers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Text Resizing</h3>
                <p className="text-gray-600">
                  Text can be resized up to 200% without loss of content or functionality using 
                  browser text resize options.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Color Contrast</h3>
                <p className="text-gray-600">
                  We maintain sufficient color contrast ratios between text and background colors 
                  to ensure readability.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Alternative Text</h3>
                <p className="text-gray-600">
                  We provide alternative text for images and other non-text content to ensure 
                  they are accessible to screen reader users.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">KNOWN LIMITATIONS</h2>
            <p className="mb-4">
              Despite our best efforts to ensure accessibility of the DBC ELEGANCE website, 
              there may be some limitations. Below is a description of known limitations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Some third-party content may not be fully accessible</li>
              <li>Older PDF documents may not be accessible</li>
              <li>Some complex interactive elements may have accessibility challenges</li>
              <li>Video content may not always have captions or audio descriptions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ASSISTIVE TECHNOLOGY COMPATIBILITY</h2>
            <p className="mb-4">
              Our website has been tested with the following assistive technologies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Screen Readers</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>JAWS with Chrome</li>
                  <li>NVDA with Firefox</li>
                  <li>VoiceOver with Safari</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Browsers</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>Google Chrome</li>
                  <li>Mozilla Firefox</li>
                  <li>Apple Safari</li>
                  <li>Microsoft Edge</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">FEEDBACK AND SUPPORT</h2>
            <p className="mb-4">
              We welcome your feedback on the accessibility of the DBC ELEGANCE website. 
              Please let us know if you encounter accessibility barriers:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Contact Information:</h4>
              <ul className="space-y-2">
                <li>Email: accessibility@dbcelegance.com</li>
                <li>Phone: +33 (0)1 40 73 53 57</li>
                <li>Postal Address: 27 rue Jean Goujon, 75008 Paris, France</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                We try to respond to feedback within 5 business days.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ACCESSIBILITY ROADMAP</h2>
            <p className="mb-4">
              We are continuously working to improve the accessibility of our website. 
              Our current priorities include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enhancing keyboard navigation for complex interactive elements</li>
              <li>Improving alternative text for decorative images</li>
              <li>Adding captions to all video content</li>
              <li>Conducting regular accessibility audits</li>
              <li>Training our development team on accessibility best practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">PHYSICAL ACCESSIBILITY</h2>
            <p className="mb-4">
              In addition to digital accessibility, we are committed to ensuring our physical 
              boutiques are accessible to all customers. Most of our boutiques feature:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wheelchair-accessible entrances</li>
              <li>Accessible fitting rooms</li>
              <li>Assistance for customers with disabilities</li>
              <li>Service animals welcome</li>
            </ul>
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