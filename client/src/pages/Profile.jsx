import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import DisplayNameOnceForm from '../components/Profile/DisplayNameOnceForm';
import ProfilePictureUploader from '../components/Profile/ProfilePictureUploader';

const Profile = () => {
  const { currentUser } = useAuth();
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Profile Settings
            </h1>
            <p className="text-gray-300 mt-1">Manage your profile picture and display name</p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Picture */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
            <ProfilePictureUploader />
          </div>

          {/* Display Name */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Display Name</h2>
            <DisplayNameOnceForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
