import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BetaBadge from './BetaBadge';
import FakeCurrencyDisplay from './FakeCurrencyDisplay';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  PlusIcon, 
  CreditCardIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBagIcon },
    ...(currentUser ? [
      { path: '/wagers', label: 'My Wagers', icon: CreditCardIcon },
      { path: '/create-challenge', label: 'Create Challenge', icon: PlusIcon },
      { path: '/profile', label: 'Profile', icon: UserIcon },
    ] : [])
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-gaming border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P2P</span>
            </div>
            <span className="gaming-text text-xl font-bold">
              Peer2Pool
            </span>
            <BetaBadge size="xs" className="ml-2" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'nav-link-active'
                    : 'nav-link'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {/* Balance Display */}
                <FakeCurrencyDisplay showLabel={false} className="bg-dark-800 px-3 py-1 rounded-lg border border-gray-600" />
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors">
                    <img
                      src={currentUser.photoURL || 'https://via.placeholder.com/32'}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {userProfile?.displayName || currentUser.email?.split('@')[0]}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-gray-600 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      {userProfile?.isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                        >
                          <CogIcon className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Join Beta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-800 rounded-lg mt-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(path)
                      ? 'bg-dark-700 text-primary-400'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {currentUser ? (
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="px-3 py-2">
                    <FakeCurrencyDisplay />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-center border border-gray-600 text-gray-300 rounded-md hover:bg-dark-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-center bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    Join Beta
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;