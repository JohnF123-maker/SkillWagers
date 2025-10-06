import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import Avatar from './Avatar';

const AuthWidget = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Link
        to="/login" 
        className="rounded-xl border border-orange-600 text-orange-600 px-4 py-2 hover:bg-orange-600 hover:text-white transition-colors text-sm font-medium"
      >
        Login/Register
      </Link>
    );
  }

  return (
    <button
      onClick={() => navigate('/profile')}
      className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg transition-colors"
    >
      <Avatar 
        src={user.photoURL} 
        alt={user.displayName || 'User'} 
        size="md"
        fallbackInitials={user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0) || 'U'}
      />
      <span className="text-sm text-gray-300 hidden sm:block">
        {user.displayName || user.email}
      </span>
    </button>
  );
};

export default AuthWidget;