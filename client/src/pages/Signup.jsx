import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import BetaBadge from '../components/BetaBadge';
import ErrorTooltip from '../components/ErrorTooltip';
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    dateOfBirth: '',
    agreeToTerms: false
  });
  
  // Error state for inline validation
  const [errors, setErrors] = useState({});

  const { register, googleSignIn, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for specific fields
    validateField(name, newValue);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      
      case 'password':
        if (value && value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      
      case 'confirmPassword':
        if (value && value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      
      case 'dateOfBirth':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const birthYear = birthDate.getFullYear();
          
          // Check basic date validity first
          if (birthYear < 1930) {
            error = 'Please enter a valid birth year';
          } else if (birthDate > today) {
            error = 'Birth date cannot be in the future';
          } else {
            // Only check age if date is valid and not in future
            const age = today.getFullYear() - birthYear - 
                       (today.getMonth() < birthDate.getMonth() || 
                        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
            
            if (age < 18) {
              error = 'You must be 18 or older to register';
            }
          }
        }
        break;
      
      case 'displayName':
        if (value && value.length < 2) {
          error = 'Display name must be at least 2 characters';
        }
        break;
      
      default:
        // No validation needed for other fields
        break;
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all required fields
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const currentYear = today.getFullYear();
      const birthYear = birthDate.getFullYear();
      
      // Check basic validity first
      if (birthYear < 1930) {
        newErrors.dateOfBirth = 'Please enter a valid birth year';
      } else if (birthYear > currentYear) {
        newErrors.dateOfBirth = 'Birth year cannot be in the future';
      } else if (birthDate > today) {
        newErrors.dateOfBirth = 'Birth date cannot be in the future';
      } else {
        // Only check age if date is valid and not in future
        const age = currentYear - birthYear - 
                   (today.getMonth() < birthDate.getMonth() || 
                    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
        
        if (age < 18) {
          newErrors.dateOfBirth = 'You must be 18 or older to register';
        }
      }
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await register(
        formData.email, 
        formData.password, 
        formData.displayName,
        formData.dateOfBirth
      );
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email address is already in use' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak. Please choose a stronger password' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email address format' });
      } else {
        setErrors({ password: error.message || 'Registration failed. Please try again' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      navigate('/');
    } catch (error) {
      console.error('Google sign up error:', error);
      setErrors({ password: 'Google sign up failed. Please try again.' });
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: 'white' }}>
          Join the Beta and start with $100 fake currency
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-dark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
          {/* Google Sign Up */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium bg-dark-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryAccent disabled:opacity-50"
              style={{ color: 'white' }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
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

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="displayName" className="block text-sm font-medium" style={{ color: 'white' }}>
                  Display Name *
                </label>
                {errors.displayName && <ErrorTooltip message={errors.displayName} />}
              </div>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    border: errors.displayName ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    width: '100%',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.displayName ? '#ef4444' : '#f59e0b';
                    e.target.style.boxShadow = errors.displayName ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(245, 158, 11, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.displayName ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Your display name"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'white' }}>
                  Email address *
                </label>
                {errors.email && <ErrorTooltip message={errors.email} />}
              </div>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    width: '100%',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.email ? '#ef4444' : '#f59e0b';
                    e.target.style.boxShadow = errors.email ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(245, 158, 11, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium" style={{ color: 'white' }}>
                  Date of Birth * (18+ required)
                </label>
                {errors.dateOfBirth && <ErrorTooltip message={errors.dateOfBirth} />}
              </div>
              <div className="mt-1">
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  min="1930-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    border: errors.dateOfBirth ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    width: '100%',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.dateOfBirth ? '#ef4444' : '#f59e0b';
                    e.target.style.boxShadow = errors.dateOfBirth ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(245, 158, 11, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.dateOfBirth ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'white' }}>
                  Password *
                </label>
                {errors.password && <ErrorTooltip message={errors.password} />}
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 48px 12px 16px',
                    width: '100%',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.password ? '#ef4444' : '#f59e0b';
                    e.target.style.boxShadow = errors.password ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(245, 158, 11, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Create a password (6+ characters)"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: 'white' }}>
                  Confirm Password *
                </label>
                {errors.confirmPassword && <ErrorTooltip message={errors.confirmPassword} />}
              </div>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '12px 48px 12px 16px',
                    width: '100%',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#f59e0b';
                    e.target.style.boxShadow = errors.confirmPassword ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(245, 158, 11, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`h-4 w-4 text-primaryAccent focus:ring-primaryAccent border rounded bg-dark-700 ${
                    errors.agreeToTerms ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm" style={{ color: 'white' }}>
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-primaryAccent hover:text-purple-400 underline bg-transparent border-none cursor-pointer"
                    onClick={() => window.open('/terms', '_blank')}
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-primaryAccent hover:text-purple-400 underline bg-transparent border-none cursor-pointer"
                    onClick={() => window.open('/privacy', '_blank')}
                  >
                    Privacy Policy
                  </button>
                </label>
                {errors.agreeToTerms && <ErrorTooltip message={errors.agreeToTerms} />}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-primaryAccent hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryAccent disabled:opacity-50"
                style={{ color: 'white' }}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlusIcon className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
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
