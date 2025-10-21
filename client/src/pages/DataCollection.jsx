import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DataCollection = () => {
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
            Data Collection Policy
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
              This Data Collection Policy outlines how SkillWagers collects, uses, and protects 
              user data during the beta testing phase. We are committed to transparency in our 
              data practices and protecting your privacy while providing our gaming platform services.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information necessary to provide and improve our services, including:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Account information (email, display name)</li>
              <li>• Gaming activity and challenge participation</li>
              <li>• Technical data (IP address, browser information)</li>
              <li>• Performance metrics and analytics data</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
            <p className="text-gray-300 leading-relaxed">
              Your data helps us improve SkillWagers and provide personalized experiences. 
              We use collected information for platform functionality, security, and analytics 
              purposes only.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. 
              All data is encrypted and stored securely using Firebase infrastructure.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to access, update, or delete your personal data. Contact our 
              support team for assistance with data-related requests.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            This policy is part of our beta testing program. Content may be updated based on user feedback and legal requirements.
            <br />
            <strong>Note for AI:</strong> Please fill this page with comprehensive, legally sound content about data collection practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataCollection;