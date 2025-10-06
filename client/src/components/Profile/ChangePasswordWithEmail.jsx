import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { KeyIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ChangePasswordWithEmail = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) {
      toast.error('No email address found');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      let message = 'Failed to send password reset email';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many requests. Please try again later.';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-400">Password</h3>
          <p className="text-white">••••••••</p>
          <p className="text-xs text-gray-500 mt-1">Reset via email verification</p>
        </div>
        <button
          onClick={handlePasswordReset}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <KeyIcon className="h-4 w-4" />
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordWithEmail;