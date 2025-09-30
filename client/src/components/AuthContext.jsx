import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Setup axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get Firebase token
          const idToken = await user.getIdToken();
          setToken(idToken);
          
          // Fetch user profile from backend
          const response = await axios.get(`${API_BASE_URL}/auth/profile`);
          setUserProfile(response.data.user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setToken(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [API_BASE_URL]);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const register = async (email, password, displayName, dateOfBirth) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update Firebase profile
    await updateProfile(user, { displayName });
    
    // Register user in backend
    const idToken = await user.getIdToken();
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
      dateOfBirth: dateOfBirth
    }, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
    
    setUserProfile(response.data.user);
    return user;
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setToken(null);
  };

  const updateUserProfile = async (updates) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, updates);
      setUserProfile(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const verifyAge = async (dateOfBirth) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-age`, {
        dateOfBirth: dateOfBirth
      });
      
      // Update local profile
      setUserProfile(prev => ({
        ...prev,
        ageVerified: true
      }));
      
      return response.data;
    } catch (error) {
      console.error('Error verifying age:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`);
      setUserProfile(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    token,
    login,
    register,
    logout,
    updateUserProfile,
    verifyAge,
    refreshProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};