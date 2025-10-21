import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Avatar from './Avatar';
import { 
  UserIcon, 
  ChartBarIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const AuthWidget = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [signOutClicked, setSignOutClicked] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSignOutClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setSignOutClicked(false);
    }
  };

  const handleSignOut = async () => {
    if (!signOutClicked) {
      setSignOutClicked(true);
      return;
    }
    
    try {
      await logout();
      setIsDropdownOpen(false);
      setSignOutClicked(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!currentUser) {
    return (
      <Link
        to="/login" 
        className="rounded-xl border border-brand text-brand px-4 py-2 hover:bg-brand hover:text-white transition-colors text-sm font-medium"
      >
        Login/Register
      </Link>
    );
  }

  const dropdownItems = [
    {
      label: 'Profile',
      icon: UserIcon,
      href: '/profile',
      description: 'View your profile information'
    },
    {
      label: 'Statistics', 
      icon: ChartBarIcon,
      href: '/statistics',
      description: 'View your performance stats'
    },
    {
      label: 'Settings',
      icon: CogIcon, 
      href: '/settings',
      description: 'Account settings and preferences'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryAccent focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <Avatar 
          src={currentUser.photoURL} 
          alt={userProfile?.displayName || currentUser.displayName || 'User'} 
          size="md"
          fallbackInitials={
            (userProfile?.displayName || currentUser.displayName)?.charAt(0) || 
            currentUser.email?.charAt(0) || 'U'
          }
        />
        <span className="text-sm text-gray-300 hidden sm:block">
          {userProfile?.displayName || currentUser.displayName || currentUser.email}
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isDropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {dropdownItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            ))}
            
            <div className="border-t border-gray-700 mt-1 pt-1">
              <button
                onClick={handleSignOut}
                className={`flex items-center w-full px-4 py-3 text-sm transition-colors text-left ${
                  signOutClicked 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                role="menuitem"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium">
                    {signOutClicked ? 'Confirm Sign Out' : 'Sign Out'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {signOutClicked ? 'Click again to confirm' : 'End your session'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthWidget;
