import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ResponsibleGamingPolicy = () => {
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
            Responsible Gaming Policy
          </h1>
          <p className="text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
            Last updated: October 21, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8" style={{ fontFamily: 'Georgia, serif' }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SkillWagers is committed to promoting responsible gaming practices and ensuring 
              our platform remains a safe, skill-based environment for competitive gaming. 
              We prioritize user wellbeing over platform engagement.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Skill-Based Platform</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SkillWagers exclusively features skill-based challenges that require:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Strategic thinking and planning</li>
              <li>• Knowledge and expertise in specific areas</li>
              <li>• Practice and improvement over time</li>
              <li>• Measurable skill development</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              We strictly prohibit games of pure chance, luck-based activities, or random 
              outcomes that cannot be influenced by skill or strategy.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Beta Testing Environment</h2>
            <p className="text-gray-300 leading-relaxed">
              During beta testing, all wagering uses virtual simulation coins (SIM) with no 
              real-world value. This ensures a safe learning environment where users can 
              experience platform features without financial risk.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Protection Measures</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We implement several measures to promote responsible gaming:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Age verification requirements (18+)</li>
              <li>• Challenge limits and cooling-off periods</li>
              <li>• Clear terms about virtual currency limitations</li>
              <li>• Educational resources about skill development</li>
              <li>• Dispute resolution processes for fair play</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Warning Signs</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Be aware of these signs that may indicate unhealthy gaming behavior:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• Spending excessive time on the platform</li>
              <li>• Neglecting responsibilities or relationships</li>
              <li>• Feeling anxious or upset when unable to participate</li>
              <li>• Chasing losses or becoming overly competitive</li>
              <li>• Lying about time spent or activities on the platform</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Getting Help</h2>
            <p className="text-gray-300 leading-relaxed">
              If you or someone you know shows signs of problematic gaming behavior, resources 
              are available. Contact our support team for platform-specific assistance or 
              reach out to gaming addiction support organizations.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Remember: SkillWagers is designed for entertainment and skill development, not 
              as a source of income or primary recreational activity.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibond mb-4">Account Controls</h2>
            <p className="text-gray-300 leading-relaxed">
              Users can request account restrictions, temporary suspensions, or permanent 
              account closure at any time. We respect these requests and provide immediate 
              assistance for users seeking to limit their platform engagement.
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
            Responsible gaming is a shared responsibility between SkillWagers and our users.
            <br />
            <strong>Note for AI:</strong> Please expand with comprehensive responsible gaming policies, addiction resources, and platform safety measures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleGamingPolicy;