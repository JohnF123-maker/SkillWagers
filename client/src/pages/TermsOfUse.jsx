import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TermsOfUse = () => {
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
            Terms of Use
          </h1>
          <p className="text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
            Last updated: October 21, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8" style={{ fontFamily: 'Georgia, serif' }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Platform Usage</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SkillWagers provides a skill-based gaming platform for competitive challenges. 
              By using our services, you agree to use the platform responsibly and in 
              accordance with these Terms of Use.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You may use SkillWagers for legitimate skill-based gaming activities. 
              Acceptable uses include:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Creating and participating in skill-based challenges</li>
              <li>• Engaging respectfully with other users</li>
              <li>• Providing constructive feedback during beta testing</li>
              <li>• Using platform features as intended</li>
              <li>• Following community guidelines and platform rules</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Prohibited Activities</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The following activities are strictly prohibited:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Creating challenges based on luck, chance, or random outcomes</li>
              <li>• Attempting to exploit platform vulnerabilities or bugs</li>
              <li>• Using multiple accounts or providing false information</li>
              <li>• Harassing, threatening, or abusing other users</li>
              <li>• Sharing account credentials or transferring accounts</li>
              <li>• Attempting to manipulate challenge outcomes unfairly</li>
              <li>• Using automated tools or bots to gain advantages</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Account Management</h2>
            <p className="text-gray-300 leading-relaxed">
              You are responsible for maintaining your account security and all activities 
              under your account. Keep your login credentials secure and notify us immediately 
              of any unauthorized access or security breaches.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Content and Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              Users retain rights to their original content but grant SkillWagers permission 
              to use, display, and distribute content as necessary for platform operation. 
              Respect intellectual property rights of others and do not share copyrighted material.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Platform Availability</h2>
            <p className="text-gray-300 leading-relaxed">
              We strive to maintain platform availability but cannot guarantee continuous, 
              uninterrupted service. Maintenance, updates, and unforeseen technical issues 
              may temporarily affect platform access.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Enforcement</h2>
            <p className="text-gray-300 leading-relaxed">
              Violations of these Terms of Use may result in warnings, temporary suspensions, 
              or permanent account termination. We reserve the right to investigate violations 
              and take appropriate action to maintain platform integrity.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update these Terms of Use to reflect platform changes, legal requirements, 
              or operational improvements. Users will be notified of significant changes and 
              continued use indicates acceptance of updated terms.
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
            These Terms of Use help ensure a fair, safe, and enjoyable experience for all SkillWagers users.
            <br />
            <strong>Note for AI:</strong> Please expand with comprehensive usage terms, enforcement policies, and legal compliance details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;