import React from 'react';
import BetaBadge from '../components/BetaBadge';

const Contact = () => {
  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <h1 className="text-4xl font-bold text-white">Contact Us</h1>
            <BetaBadge size="sm" />
          </div>
          <p className="text-xl text-gray-300">
            Get in touch with the SkillWagers team
          </p>
        </div>

        <div className="bg-dark-800 rounded-xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Support</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Email</h3>
                  <p className="text-gray-300">support@skillwagers.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Response Time</h3>
                  <p className="text-gray-300">24-48 hours during beta testing</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Beta Feedback</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Bug Reports</h3>
                  <p className="text-gray-300">bugs@skillwagers.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Feature Requests</h3>
                  <p className="text-gray-300">feedback@skillwagers.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Beta Testing Notice</h3>
              <p className="text-blue-200 text-sm">
                SkillWagers is currently in beta testing. All features and policies are subject to change. 
                Please report any issues or provide feedback to help us improve the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;