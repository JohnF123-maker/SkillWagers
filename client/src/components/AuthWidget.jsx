import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import Avatar from './Avatar';

const AuthWidget = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
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
    <div className="flex items-center gap-3">
      <Avatar 
        src={user.photoURL} 
        alt={user.displayName || 'User'} 
        size="md"
        fallbackInitials={user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0) || 'U'}
      />
      <span className="text-sm text-gray-300 hidden sm:block">
        {user.displayName || user.email}
      </span>
      <button 
        className="rounded-xl border border-gray-300 text-gray-300 hover:text-white hover:border-white px-3 py-1 transition-colors text-sm"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  );
};

export default AuthWidget;