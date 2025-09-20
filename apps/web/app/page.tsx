import React from "react";
import Navbar from "./components/navbar";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <main className="pt-16">
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Future
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the next generation of digital innovation with our
                cutting-edge platform designed for modern businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Get Started
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:border-blue-400 hover:text-blue-600 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Lightning Fast",
                  description:
                    "Experience blazing fast performance with our optimized infrastructure.",
                  icon: "⚡",
                },
                {
                  title: "Secure & Reliable",
                  description:
                    "Your data is protected with enterprise-grade security measures.",
                  icon: "🔒",
                },
                {
                  title: "24/7 Support",
                  description:
                    "Get help whenever you need it with our round-the-clock support team.",
                  icon: "🚀",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of companies already using our platform to drive
              growth and innovation.
            </p>
            <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-xl hover:shadow-xl hover:scale-105 transition-all duration-300">
              Start Your Journey
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Brand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
