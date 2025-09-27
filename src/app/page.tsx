"use client";

import { useState } from "react";
import { Link2, Zap, BarChart3, Shield } from "lucide-react";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import UrlList from "@/components/UrlList";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                URL Shortener
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                How it works
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Shorten Your URLs
            <span className="block text-blue-600">In Seconds</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Create short, memorable links with advanced analytics, custom
            aliases, and QR codes. Perfect for social media, marketing
            campaigns, and tracking engagement.
          </p>

          <UrlShortenerForm onUrlCreated={handleUrlCreated} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need for professional link management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h4>
              <p className="text-gray-600">
                Generate shortened URLs instantly with our optimized
                infrastructure
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Analytics
              </h4>
              <p className="text-gray-600">
                Track clicks, monitor performance, and gain insights into your
                links
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Custom Aliases
              </h4>
              <p className="text-gray-600">
                Create branded, memorable short links with custom aliases
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h4>
              <p className="text-gray-600">
                Enterprise-grade security with 99.9% uptime guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* URL List Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UrlList refreshTrigger={refreshTrigger} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Link2 className="h-6 w-6" />
              <span className="text-xl font-bold">URL Shortener</span>
            </div>
            <p className="text-gray-400 mb-4">
              Fast, reliable, and secure URL shortening service
            </p>
            <p className="text-sm text-gray-500">
              © 2024 URL Shortener. Built with Next.js and Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
