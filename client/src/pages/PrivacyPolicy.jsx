import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
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
            Privacy Policy
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
              Your privacy is important to us. This Privacy Policy explains how SkillWagers 
              collects, uses, and protects your personal information when you use our 
              skill-based gaming platform.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information to provide and improve our services:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• <strong>Account Information:</strong> Email address, display name, profile picture</li>
              <li>• <strong>Usage Data:</strong> Challenge participation, gaming activity, platform interactions</li>
              <li>• <strong>Technical Information:</strong> IP address, device information, browser type</li>
              <li>• <strong>Communication Data:</strong> Support messages, feedback, dispute reports</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your information helps us provide, maintain, and improve SkillWagers:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Provide platform functionality and user experience</li>
              <li>• Process challenges and maintain fair play</li>
              <li>• Communicate with you about your account and services</li>
              <li>• Improve platform security and prevent fraud</li>
              <li>• Analyze usage patterns to enhance features</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell or rent your personal information. We may share information only 
              in limited circumstances: with your consent, for legal compliance, or to protect 
              our rights and users' safety.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or 
              destruction using industry-standard security practices.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Your Privacy Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have rights regarding your personal information:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Access and review your personal data</li>
              <li>• Request corrections to inaccurate information</li>
              <li>• Delete your account and associated data</li>
              <li>• Export your data in a portable format</li>
              <li>• Opt out of certain data processing activities</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please 
              contact our support team through the platform or email us directly.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            We are committed to protecting your privacy and will update this policy as needed.
            <br />
            <strong>Note for AI:</strong> Please expand with comprehensive privacy policy details including GDPR compliance, data retention, and regional privacy laws.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;