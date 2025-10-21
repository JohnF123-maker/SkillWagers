import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../components/AuthContext';
import { registerSchema } from '../validation/authSchemas';
import BetaBadge from '../components/BetaBadge';
import AuthInput from '../components/forms/AuthInput';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register: authRegister, googleSignIn, currentUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",  // Validate when field loses focus
    reValidateMode: "onChange"  // Re-validate on change after first validation
  });

  const currentYear = new Date().getFullYear();

  // Redirect authenticated users
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmitError('');

    try {
      await authRegister(
        data.email, 
        data.password, 
        data.displayName,
        data.dateOfBirth
      );
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('email', { message: 'This email address is already in use' });
      } else if (error.code === 'auth/weak-password') {
        setError('password', { message: 'Password is too weak. Please choose a stronger password' });
      } else if (error.code === 'auth/invalid-email') {
        setError('email', { message: 'Invalid email address format' });
      } else {
        setSubmitError(error.message || 'Registration failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      await googleSignIn();
      navigate('/');
    } catch (error) {
      console.error('Google sign up error:', error);
      setSubmitError('Google sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          Join the Beta
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: 'white' }}>
          Or{' '}
          <Link 
            to="/login" 
            className="font-medium text-primaryAccent hover:text-purple-400"
            style={{ color: 'white' }}
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-card">
          {/* Google Sign Up */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-dark-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryAccent disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-800" style={{ color: 'white' }}>Or sign up with email</span>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {submitError && (
              <div className="bg-red-600 text-white p-3 rounded-md text-sm">
                {submitError}
              </div>
            )}

            <AuthInput
              label="Display Name *"
              name="displayName"
              placeholder="Choose a display name"
              register={register}
              error={errors.displayName}
            />

            <AuthInput
              label="Email address *"
              name="email"
              type="email"
              placeholder="Enter your email address"
              register={register}
              error={errors.email}
            />

            <AuthInput
              label="Date of Birth * (18+ required)"
              name="dateOfBirth"
              type="date"
              register={register}
              error={errors.dateOfBirth}
              inputProps={{
                min: "1930-01-01",
                max: `${currentYear}-12-31`,
                onInput: (e) => {
                  let value = e.target.value;
                  // Remove any non-digit and non-hyphen characters
                  value = value.replace(/[^\d-]/g, '');
                  
                  // Enforce YYYY-MM-DD format with 4-digit year maximum
                  if (value.length > 10) {
                    value = value.slice(0, 10);
                  }
                  
                  // Prevent typing more than 4 digits for year
                  const yearMatch = value.match(/^(\d{0,4})/);
                  if (yearMatch && yearMatch[1].length > 4) {
                    value = yearMatch[1].slice(0, 4) + value.slice(yearMatch[1].length);
                  }
                  
                  e.target.value = value;
                },
                onKeyPress: (e) => {
                  // Prevent entering more than 4 digits for year
                  const value = e.target.value;
                  const cursorPos = e.target.selectionStart;
                  
                  // If we're in the year section (first 4 characters) and already have 4 digits
                  if (cursorPos <= 4 && value.replace(/[^\d]/g, '').length >= 4 && cursorPos < 4) {
                    // Only allow if we're replacing existing characters
                    if (e.target.selectionStart === e.target.selectionEnd) {
                      e.preventDefault();
                    }
                  }
                }
              }}
            />

            <AuthInput
              label="Password *"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              register={register}
              error={errors.password}
            />

            <AuthInput
              label="Confirm Password *"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              register={register}
              error={errors.confirmPassword}
            />

            <div className="inline-flex items-start gap-2">
              <input
                id="agreeTerms"
                type="checkbox"
                className="h-4 w-4 mt-0.5 cursor-pointer"
                {...register('agreeToTerms')}
                aria-labelledby="termsLabel"
                required
              />
              <div className="text-sm leading-5 text-white" id="termsLabel" role="note">
                I agree to the{" "}
                <Link to="/legal/terms-and-conditions" className="underline hover:opacity-80">Terms and Conditions</Link>
                {" "}and{" "}
                <Link to="/legal/privacy-policy" className="underline hover:opacity-80">Privacy Policy</Link>.
                {" "}You must agree to the terms and conditions.
              </div>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs mt-1">
                You must agree to the Terms and Conditions and Privacy Policy to continue.
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
                style={{ color: 'white' }}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlusIcon className="h-5 w-5 text-brand group-hover:text-white" />
                </span>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800" style={{ color: 'white' }}>
                  Already have an account?{' '}
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

export default Signup;