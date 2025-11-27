"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function Sustainability() {
  let router = useRouter();

  const commitments = [
    {
      title: "RESPONSIBLE SOURCING",
      description: "We meticulously trace our supply chain to ensure all materials meet our ethical and environmental standards.",
      initiatives: [
        "100% traceable leather supply by 2025",
        "Conflict-free gemstone policy",
        "FSC-certified packaging"
      ]
    },
    {
      title: "CARBON NEUTRALITY",
      description: "Committed to achieving carbon neutrality across all operations through reduction and offset initiatives.",
      initiatives: [
        "100% renewable energy in workshops",
        "Carbon offset programs",
        "Efficient logistics optimization"
      ]
    },
    {
      title: "CIRCULAR ECONOMY",
      description: "Promoting longevity and repairability to extend product lifecycles and reduce waste.",
      initiatives: [
        "Lifetime repair services",
        "Product care workshops",
        "Recycling programs"
      ]
    },
    {
      title: "ARTISAN WELFARE",
      description: "Ensuring fair working conditions and preserving traditional craftsmanship for future generations.",
      initiatives: [
        "Fair wage certification",
        "Apprenticeship programs",
        "Healthcare and benefits"
      ]
    }
  ];

  const milestones = [
    { year: "2010", achievement: "First sustainability report published" },
    { year: "2015", achievement: "100% of workshops converted to renewable energy" },
    { year: "2018", achievement: "Plastic-free packaging initiative launched" },
    { year: "2020", achievement: "Carbon neutral certification achieved" },
    { year: "2023", achievement: "80% material traceability achieved" }
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
            SUSTAINABILITY
          </h1>
          <div className="w-20 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            True luxury is sustainable. At DBC ELEGANCE, we believe that elegance must 
            extend beyond aesthetics to encompass environmental stewardship and social responsibility.
          </p>
        </div>

        {/* Commitments */}
        <section className="mb-16">
          <h2 className="text-xl font-light text-gray-900 mb-8 text-center">
            OUR COMMITMENTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commitments.map((commitment, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{commitment.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{commitment.description}</p>
                <ul className="space-y-2">
                  {commitment.initiatives.map((initiative, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">{initiative}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Progress Timeline */}
        <section className="mb-16">
          <h2 className="text-xl font-light text-gray-900 mb-8 text-center">
            SUSTAINABILITY MILESTONES
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <span className="font-semibold text-gray-900">{milestone.year}</span>
                  <span className="text-gray-600 text-right">{milestone.achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Goals */}
        <section className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h2 className="text-xl font-light text-gray-900 mb-6 text-center">
            2025 SUSTAINABILITY GOALS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-semibold">100%</span>
              </div>
              <p className="text-gray-600 text-sm">Traceable Materials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-semibold">0%</span>
              </div>
              <p className="text-gray-600 text-sm">Waste to Landfill</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-semibold">50%</span>
              </div>
              <p className="text-gray-600 text-sm">Carbon Reduction</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-semibold">100%</span>
              </div>
              <p className="text-gray-600 text-sm">Ethical Certification</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Download our latest Sustainability Report to learn more about our initiatives and progress.
          </p>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
            Download Sustainability Report
          </button>
        </div>
      </div>
    </div>
  );
}