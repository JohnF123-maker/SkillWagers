import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BetaBadge from './BetaBadge';
import FakeCurrencyDisplay from './FakeCurrencyDisplay';
import AuthWidget from './AuthWidget';
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
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    // For the home button, check both / and /home depending on user status
    if (path === (currentUser ? '/home' : '/')) {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname === path;
  };

  const navLinks = [
    { path: currentUser ? '/home' : '/', label: 'Home', icon: HomeIcon },
    { path: '/wagering', label: 'Wagering', icon: CreditCardIcon },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBagIcon },
    ...(currentUser ? [
      { path: '/wagers', label: 'My Wagers', icon: CreditCardIcon },
    ] : [])
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-gaming border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="gaming-text text-xl font-bold">
              SkillWagers
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
            <AuthWidget />
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
              
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="px-3 py-2">
                  <AuthWidget />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;