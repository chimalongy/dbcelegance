"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function TheHouseOfDBC() {
  let router = useRouter();
  const [activeSection, setActiveSection] = useState('HERITAGE');

  const sections = [
    {
      id: 'HERITAGE',
      title: "HERITAGE",
      description: "Discover the rich history and legacy of DBC ELEGANCE",
      content: {
        timeline: [
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
          }
        ],
        principles: [
          {
            title: "QUALITY",
            description: "Uncompromising standards in materials, craftsmanship, and attention to detail",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          },
          {
            title: "INNOVATION",
            description: "Continuous evolution while respecting traditional techniques and values",
            icon: "M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
          },
          {
            title: "ELEGANCE",
            description: "Timeless style that transcends trends and generations",
            icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1"
          }
        ]
      }
    },
    {
      id: 'CRAFTSMANSHIP',
      title: "CRAFTSMANSHIP",
      description: "Explore the artisanal techniques that define our creations",
      content: {
        techniques: [
          {
            title: "LEATHER WORKING",
            description: "Our master leather artisans employ techniques passed down through generations, ensuring each piece develops a unique patina over time.",
            details: [
              "Vegetable-tanned leathers from European tanneries",
              "Hand-cutting and stitching",
              "Natural edge painting"
            ]
          },
          {
            title: "HAUTE COUTURE",
            description: "Each couture garment requires hundreds of hours of meticulous handwork, from precise pattern cutting to intricate embroidery.",
            details: [
              "Hand-finished seams and hems",
              "Custom-developed fabrics",
              "Artisanal embroidery techniques"
            ]
          },
          {
            title: "FINE JEWELRY",
            description: "Our jewelry atelier combines traditional goldsmith techniques with innovative stone setting methods.",
            details: [
              "Lost-wax casting",
              "Hand engraving and polishing",
              "Precious stone selection and setting"
            ]
          }
        ],
        workshops: [
          {
            location: "Paris, France",
            specialty: "Haute Couture & Leather Goods",
            established: 1858,
            artisans: 120
          },
          {
            location: "Florence, Italy",
            specialty: "Leather Goods & Shoes",
            established: 1972,
            artisans: 85
          },
          {
            location: "La Chaux-de-Fonds, Switzerland",
            specialty: "Watchmaking",
            established: 1985,
            artisans: 45
          }
        ]
      }
    },
    {
      id: 'SUSTAINABILITY',
      title: "SUSTAINABILITY",
      description: "Our commitment to responsible luxury and environmental stewardship",
      content: {
        commitments: [
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
          }
        ],
        milestones: [
          { year: "2010", achievement: "First sustainability report published" },
          { year: "2015", achievement: "100% of workshops converted to renewable energy" },
          { year: "2018", achievement: "Plastic-free packaging initiative launched" },
          { year: "2020", achievement: "Carbon neutral certification achieved" }
        ]
      }
    },
    {
      id: 'ARTISTIC_DIRECTION',
      title: "ARTISTIC DIRECTION",
      description: "The creative vision guiding our collections",
      content: {
        team: [
          {
            name: "ISABELLE MARCHAND",
            role: "Creative Director",
            tenure: "2018-Present",
            philosophy: "Elegance is about subtraction, not addition. True luxury lies in the perfection of essential details.",
            achievements: [
              "Revitalized heritage codes for contemporary audiences",
              "Introduced sustainable luxury initiatives",
              "Expanded into new product categories"
            ]
          },
          {
            name: "ANTOINE DELACROIX",
            role: "Head of Women's Collections",
            tenure: "2015-Present",
            philosophy: "Fashion should empower the wearer while respecting artisanal traditions.",
            achievements: [
              "Developed innovative fabric treatments",
              "Pioneered zero-waste pattern cutting",
              "Mentored emerging design talent"
            ]
          }
        ],
        pillars: [
          {
            title: "HERITAGE CODES",
            description: "Respecting and reinterpreting the iconic elements that define DBC ELEGANCE's identity across generations.",
            elements: ["Signature color palette", "Architectural silhouettes", "Symbolic motifs"]
          },
          {
            title: "MODERN SENSIBILITY",
            description: "Adapting traditional craftsmanship to meet the needs and aesthetics of contemporary life.",
            elements: ["Functional elegance", "Versatile pieces", "Timeless appeal"]
          }
        ]
      }
    },
    {
      id: 'FASHION_SHOWS',
      title: "FASHION SHOWS",
      description: "Experience our latest runway presentations",
      content: {
        shows: [
          {
            season: "Spring/Summer 2024",
            location: "Palais Garnier, Paris",
            theme: "Renaissance Moderne",
            highlights: [
              "Sustainable silk innovations",
              "Collaboration with contemporary artists",
              "Digital immersive experience"
            ]
          },
          {
            season: "Fall/Winter 2023",
            location: "Musée des Arts Décoratifs",
            theme: "Urban Elegance",
            highlights: [
              "Technical fabric developments",
              "Evening wear reimagined",
              "Heritage craftsmanship spotlight"
            ]
          },
          {
            season: "Spring/Summer 2023",
            location: "Jardin des Tuileries",
            theme: "Luminous Simplicity",
            highlights: [
              "Lightweight construction techniques",
              "Color theory exploration",
              "Accessories integration"
            ]
          }
        ]
      }
    },
    {
      id: 'EXHIBITIONS',
      title: "EXHIBITIONS",
      description: "Current and past exhibitions celebrating our heritage",
      content: {
        current: [
          {
            title: "ELEGANCE THROUGH TIME",
            location: "Musée des Arts Décoratifs, Paris",
            dates: "March 15 - September 30, 2024",
            description: "A comprehensive retrospective showcasing 160 years of DBC ELEGANCE design evolution and cultural impact."
          }
        ],
        past: [
          {
            title: "THE ART OF CRAFTSMANSHIP",
            location: "Victoria & Albert Museum, London",
            dates: "2022",
            description: "An intimate look at the artisanal techniques that define DBC ELEGANCE's luxury creations."
          },
          {
            title: "MODERN HERITAGE",
            location: "Metropolitan Museum of Art, New York",
            dates: "2020",
            description: "Exploring how traditional craftsmanship meets contemporary design in the DBC ELEGANCE universe."
          }
        ]
      }
    }
  ];

  const currentSection = sections.find(section => section.id === activeSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'HERITAGE':
        return (
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
              {currentSection.content.timeline.map((item, index) => (
                <div key={index} className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-8 md:ml-auto md:w-1/2' : 'md:pl-8 md:mr-auto md:w-1/2'}`}>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-white z-10"></div>
                  <div className="ml-12 md:ml-0 bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-light text-gray-900 mr-4">{item.year}</span>
                      <span className="text-lg font-semibold text-gray-700">{item.title}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {currentSection.content.principles.map((principle, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={principle.icon} />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'CRAFTSMANSHIP':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              {currentSection.content.techniques.map((technique, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{technique.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{technique.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {technique.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-gray-900 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {currentSection.content.workshops.map((workshop, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{workshop.location}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{workshop.specialty}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Est. {workshop.established}</span>
                    <span>{workshop.artisans} Artisans</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'SUSTAINABILITY':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSection.content.commitments.map((commitment, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
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
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sustainability Milestones</h3>
              <div className="space-y-4">
                {currentSection.content.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <span className="font-semibold text-gray-900">{milestone.year}</span>
                    <span className="text-gray-600 text-right">{milestone.achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'ARTISTIC_DIRECTION':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              {currentSection.content.team.map((member, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-gray-600">{member.role} • {member.tenure}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">"{member.philosophy}"</p>
                  <div className="space-y-2">
                    {member.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-gray-900 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {currentSection.content.pillars.map((pillar, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{pillar.description}</p>
                  <div className="space-y-2">
                    {pillar.elements.map((element, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                        <span className="text-gray-600 text-sm">{element}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'FASHION_SHOWS':
        return (
          <div className="space-y-6">
            {currentSection.content.shows.map((show, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{show.season}</h3>
                    <p className="text-gray-600">{show.location}</p>
                  </div>
                  <span className="text-gray-900 font-medium mt-2 md:mt-0">{show.theme}</span>
                </div>
                <div className="space-y-2">
                  {show.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-gray-900 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'EXHIBITIONS':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Exhibition</h3>
              {currentSection.content.current.map((exhibition, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{exhibition.title}</h4>
                  <p className="text-gray-600 mb-2">{exhibition.location}</p>
                  <p className="text-gray-600 mb-3">{exhibition.dates}</p>
                  <p className="text-gray-600 text-sm">{exhibition.description}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Exhibitions</h3>
              <div className="space-y-4">
                {currentSection.content.past.map((exhibition, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{exhibition.title}</h4>
                    <p className="text-gray-600 mb-2">{exhibition.location}</p>
                    <p className="text-gray-600 mb-3">{exhibition.dates}</p>
                    <p className="text-gray-600 text-sm">{exhibition.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
      
      <div className="max-w-7xl mx-auto pt-[100px] lg:pt-[150px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-2xl font-light text-gray-900 tracking-wide mb-4">
            THE HOUSE OF DBC ELEGANCE
          </h1>
          <div className="w-20 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Since 1858, DBC ELEGANCE has epitomized French luxury craftsmanship, 
            blending timeless elegance with innovative design to create pieces that 
            transcend generations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">EXPLORE THE HOUSE</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      activeSection === section.id ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </p>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-2">{currentSection?.title}</h2>
              <div className="w-20 h-0.5 bg-gray-900"></div>
            </div>

            <div className="space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}