import React from "react";
import {
  Menu,
  X,
  User,
  LogIn,
  LayoutDashboard,
  Zap,
  Shield,
  Headphones,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "@repo/ui/topbar";

export default function LandingPage() {
  const features = [
    {
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with our optimized infrastructure powered by cutting-edge technology.",
      icon: Zap,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Secure & Reliable",
      description:
        "Your data is protected with enterprise-grade security measures and 99.9% uptime guarantee.",
      icon: Shield,
      gradient: "from-blue-600 to-blue-700",
    },
    {
      title: "24/7 Support",
      description:
        "Get help whenever you need it with our dedicated support team and comprehensive documentation.",
      icon: Headphones,
      gradient: "from-blue-700 to-blue-800",
    },
  ];

  const benefits = [
    "Increase productivity by 300%",
    "Reduce operational costs significantly",
    "Scale effortlessly with growing demand",
    "Integrate with existing tools seamlessly",
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-800/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Now available worldwide
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  Future of Work
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Transform your business operations with our intelligent
                platform. Built for modern teams who demand excellence,
                security, and seamless collaboration.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>

                <button className="px-8 py-4 border-2 border-blue-200 text-blue-700 rounded-full font-semibold text-lg hover:border-blue-400 hover:bg-blue-50 hover:scale-105 transition-all duration-300">
                  Watch Demo
                </button>
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-blue-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-blue-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-blue-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the perfect blend of power, simplicity, and
                reliability that thousands of teams trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 shadow-sm border border-blue-100 hover:shadow-xl hover:scale-105 hover:border-blue-200 transition-all duration-300"
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}
                  >
                    <feature.icon size={32} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
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

        {/* Benefits Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  Transform Your Business Today
                </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  Join thousands of forward-thinking companies who have
                  revolutionized their operations with our platform. See
                  immediate results and long-term growth.
                </p>

                <ul className="space-y-6 mb-12">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                  <span>Start Your Free Trial</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>

              <div className="relative">
                <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-12 shadow-2xl">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="space-y-4">
                      <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-blue-100 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-blue-200 rounded w-1/2 animate-pulse"></div>
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl"></div>
                        <div className="h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join over 50,000+ companies already using our platform to drive
              growth, increase efficiency, and stay ahead of the competition.
              Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group px-12 py-5 bg-white text-blue-700 rounded-full font-semibold text-xl hover:bg-blue-50 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>

              <button className="px-12 py-5 border-2 border-white/30 text-white rounded-full font-semibold text-xl hover:border-white hover:bg-white/10 hover:scale-105 transition-all duration-300">
                Contact Sales
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-blue-200">
              <span>✓ Trusted by Fortune 500 companies</span>
              <span>✓ 99.9% uptime SLA</span>
              <span>✓ World-class support</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Brand
              </span>
              <p className="text-gray-400 mt-4">
                Transforming businesses with innovative solutions since 2020.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2025 Brand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
