"use client";

import { useState } from 'react';

export default function AboutUsPage() {
  const [activeStory, setActiveStory] = useState('mission');

  const values = [
    {
      icon: "🎯",
      title: "Our Mission",
      description: "To redefine urban fashion by blending contemporary styles with timeless elegance, making premium quality accessible to everyone."
    },
    {
      icon: "👁️",
      title: "Our Vision",
      description: "To become India's most loved fashion brand, inspiring confidence and self-expression through thoughtfully designed apparel."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            THE NORTH SIDE
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Redefining Urban Fashion with Authenticity, Quality, and Style
          </p>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Born in the vibrant landscapes of Kerala, we've grown from a local passion project 
            to a nationally recognized brand, serving fashion enthusiasts across India.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our Mission & Vision
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              What Makes Us Different
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-600">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Premium quality fabrics sourced ethically</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Attention to detail in every stitch</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Customer-first approach in everything we do</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Innovative designs that stand the test of time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Sustainable and responsible fashion practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Affordable luxury without compromising quality</span>
                </li>
              </ul>
            </div>
          </div> */}
        </div>
      </section>

      {/* Values Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Our Core Values
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Craftsmanship</h3>
              <p className="text-gray-600">
                Every garment is crafted with precision and attention to detail, ensuring exceptional quality that lasts.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">💝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Love</h3>
              <p className="text-gray-600">
                Building lasting relationships with our community through exceptional service and genuine care.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Constantly evolving to bring you the latest in fashion trends while maintaining our unique identity.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join THE NORTH SIDE Family
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the difference of authentic, quality fashion crafted with passion and purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors"
            >
              Shop Collection
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE || '6238424799'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-gray-800 transition-colors"
            >
              Connect With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}