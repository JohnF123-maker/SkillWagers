import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import BetaBadge from '../components/BetaBadge';
import AuthInput from '../components/forms/AuthInput';
import { KeyIcon } from '@heroicons/react/24/outline';

const forgotPasswordSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address")
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onBlur"
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmitError('');

    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        setSubmitError('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        setSubmitError('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        setSubmitError('Too many password reset attempts. Please try again later');
      } else {
        setSubmitError('Failed to send password reset email. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primaryAccent to-purple-500 rounded-lg flex items-center justify-center">
              <span className="font-bold" style={{ color: 'white' }}>S</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'white' }}>SkillWagers</h1>
            <BetaBadge size="sm" />
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-bold" style={{ color: 'white' }}>
            Check Your Email
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="auth-card">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyIcon className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-gray-300 mb-6">
                We've sent a password reset link to:
              </p>
              <p className="text-primaryAccent font-medium mb-6">
                {getValues('email')}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Please check your email and click the link to reset your password. 
                If you don't see the email, check your spam folder.
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                >
                  Back to Login
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setEmailSent(false);
                    setSubmitError('');
                  }}
                  className="w-full flex justify-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryAccent"
                >
                  Try Different Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primaryAccent to-purple-500 rounded-lg flex items-center justify-center">
            <span className="font-bold" style={{ color: 'white' }}>S</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'white' }}>SkillWagers</h1>
          <BetaBadge size="sm" />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold" style={{ color: 'white' }}>
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {submitError && (
              <div className="bg-red-600 text-white p-3 rounded-md text-sm">
                {submitError}
              </div>
            )}

            <AuthInput
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              register={register}
              error={errors.email}
            />

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <KeyIcon className="h-5 w-5 text-brand group-hover:text-white" />
                </span>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0f1220] text-[#f5f7ff]">
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-primaryAccent hover:text-purple-400">
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;