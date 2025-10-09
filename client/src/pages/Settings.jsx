import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import DisplayNameOnceForm from '../components/Profile/DisplayNameOnceForm';
import ChangePasswordWithEmail from '../components/Profile/ChangePasswordWithEmail';
import SignOutConfirm from '../components/Profile/SignOutConfirm';
import { 
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { userProfile, currentUser } = useAuth();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Please log in to access settings</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-400">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Profile Settings
            </h2>
            
            <div className="space-y-6">
              {/* Email Display */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-white">{currentUser.email}</span>
                  <span className="ml-auto text-gray-400 text-sm">Verified</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Email changes are not currently supported in Beta
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Display Name
                </label>
                <DisplayNameOnceForm />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Security Settings
            </h2>
            
            <div className="space-y-6">
              {/* Password Reset */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <ChangePasswordWithEmail />
              </div>

              {/* Age Verification Status */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Age Verification
                </label>
                <div className={`flex items-center p-3 rounded-lg ${
                  userProfile?.ageVerified 
                    ? 'bg-green-500 bg-opacity-20 border border-green-500' 
                    : 'bg-yellow-500 bg-opacity-20 border border-yellow-500'
                }`}>
                  <ShieldCheckIcon className={`h-5 w-5 mr-3 ${
                    userProfile?.ageVerified ? 'text-green-400' : 'text-yellow-400'
                  }`} />
                  <div>
                    <span className={`font-medium ${
                      userProfile?.ageVerified ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {userProfile?.ageVerified ? 'Verified (18+)' : 'Pending Verification'}
                    </span>
                    {!userProfile?.ageVerified && (
                      <p className="text-yellow-300 text-sm mt-1">
                        Age verification is required to participate in wagers
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <CogIcon className="h-5 w-5 mr-2" />
              Account Management
            </h2>
            
            <div className="space-y-6">
              {/* Beta Status */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Beta Status
                </label>
                <div className="flex items-center p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg">
                  <span className="text-blue-400 mr-2">🧪</span>
                  <div>
                    <span className="text-blue-400 font-medium">Beta Tester</span>
                    <p className="text-blue-300 text-sm mt-1">
                      You have access to all beta features and testing privileges
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Account Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-white font-medium">
                      {userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Current Balance</p>
                    <p className="text-white font-medium">
                      {userProfile?.betaBalance || 0} SIM
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Session Management
                </label>
                <button
                  onClick={() => setShowSignOutModal(true)}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  Sign Out of Account
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Terms */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">
              Privacy & Terms
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-white font-medium mb-2">Data Collection</h3>
                <p className="text-gray-400 text-sm">
                  We collect minimal data necessary to provide our services. All gameplay data is anonymized for analytics.
                </p>
              </div>
              
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-white font-medium mb-2">Beta Testing Terms</h3>
                <p className="text-gray-400 text-sm">
                  As a beta tester, you agree to provide feedback and understand that features may change or be removed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Modal */}
        {showSignOutModal && (
          <SignOutConfirm 
            onCancel={() => setShowSignOutModal(false)}
            onConfirm={() => setShowSignOutModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;