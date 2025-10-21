import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BetaTestingTerms = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-primaryAccent hover:text-purple-400 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Beta Testing Terms
          </h1>
          <p className="text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
            Last updated: October 21, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8" style={{ fontFamily: 'Georgia, serif' }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Welcome to the SkillWagers Beta Program! As a beta tester, you have early access 
              to our skill-based gaming platform. This document outlines the terms and conditions 
              specific to beta participation.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Beta Program Expectations</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By participating in our beta program, you agree to:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Provide constructive feedback on platform features</li>
              <li>• Report bugs and technical issues promptly</li>
              <li>• Understand that features may change or be removed</li>
              <li>• Respect other beta testers and maintain community standards</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Virtual Currency</h2>
            <p className="text-gray-300 leading-relaxed">
              Beta testing uses virtual simulation coins (SIM) that have no real-world value. 
              These coins cannot be exchanged for money or prizes and are solely for testing 
              platform functionality.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Feedback and Communication</h2>
            <p className="text-gray-300 leading-relaxed">
              We encourage open communication about your beta experience. Your feedback helps 
              shape the final product and ensures we deliver the best possible gaming platform.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
            <p className="text-gray-300 leading-relaxed">
              Beta testing data helps us understand user behavior and improve our platform. 
              All data collection follows our privacy policy and is used solely for development purposes.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia deserunt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination of Beta Access</h2>
            <p className="text-gray-300 leading-relaxed">
              Beta access may be terminated at any time for violation of these terms or at our 
              discretion. We reserve the right to modify or end the beta program as needed.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            Beta testing terms are subject to change during the development phase.
            <br />
            <strong>Note for AI:</strong> Please expand this page with detailed beta testing terms, user obligations, and platform-specific guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaTestingTerms;