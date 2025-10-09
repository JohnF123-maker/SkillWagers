import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BetaBadge from './BetaBadge';
import BalanceBadge from './BalanceBadge';
import AuthWidget from './AuthWidget';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  UserIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/wagering', label: 'Wagering', icon: CreditCardIcon },
    ...(currentUser ? [
      { path: '/wagers', label: 'My Wagers', icon: CreditCardIcon },
      { path: '/profile', label: 'Profile', icon: UserIcon },
      { path: '/statistics', label: 'Statistics', icon: ChartBarIcon },
      { path: '/settings', label: 'Settings', icon: CogIcon },
    ] : []),
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBagIcon },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-gaming border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <img 
              src="/icons/skillwagers-512.png" 
              alt="SkillWagers" 
              className="h-6 w-6" 
            />
            <span className="font-bold text-brandAccent text-xl">
              SkillWagers
            </span>
            <BetaBadge size="xs" className="ml-2" />
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-brand'
                      : 'text-gray-300 hover:text-brand'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && <BalanceBadge />}
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
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-dark-700 text-brand'
                        : 'text-gray-300 hover:text-brand hover:bg-dark-700'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
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
