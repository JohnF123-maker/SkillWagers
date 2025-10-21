import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TermsAndConditions = () => {
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
            Terms and Conditions
          </h1>
          <p className="text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
            Last updated: October 21, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8" style={{ fontFamily: 'Georgia, serif' }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing and using SkillWagers, you accept and agree to be bound by the terms 
              and provision of this agreement. These Terms and Conditions govern your use of 
              our skill-based gaming platform.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Users must conduct themselves respectfully and follow platform guidelines. 
              Prohibited behaviors include:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Cheating or exploiting platform vulnerabilities</li>
              <li>• Harassment or abusive behavior toward other users</li>
              <li>• Creating multiple accounts to circumvent restrictions</li>
              <li>• Attempting to manipulate challenge outcomes</li>
              <li>• Violating intellectual property rights</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Platform Rules</h2>
            <p className="text-gray-300 leading-relaxed">
              SkillWagers is a skill-based platform that prohibits games of pure chance. 
              All challenges must demonstrate skill, strategy, or knowledge-based outcomes.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Account Responsibility</h2>
            <p className="text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account. Notify us immediately of any 
              unauthorized use.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              SkillWagers provides the platform "as is" without warranties. We are not liable 
              for any direct, indirect, incidental, or consequential damages arising from 
              platform use.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
            <p className="text-gray-300 leading-relaxed">
              Disputes between users regarding challenge outcomes will be handled through our 
              internal dispute resolution process. Our decisions on platform-related matters 
              are final.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Users will 
              be notified of significant changes, and continued use constitutes acceptance of 
              the modified terms.
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
            These terms govern your use of the SkillWagers platform and all related services.
            <br />
            <strong>Note for AI:</strong> Please expand with comprehensive legal terms covering liability, user rights, platform rules, and legal compliance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;