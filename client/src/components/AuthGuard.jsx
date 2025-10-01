import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BetaBadge from './BetaBadge';

const AuthGuard = ({ children, adminOnly = false }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SW</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SkillWagers</span>
          <BetaBadge size="xs" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (adminOnly && (!userProfile || !userProfile.isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SkillWagers</span>
            <BetaBadge size="xs" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. Admin privileges required.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;