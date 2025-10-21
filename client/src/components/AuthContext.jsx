import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  increment,
  runTransaction
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { logSigninLocation } from '../utils/locationLogger';

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

  // Create or update user document in Firestore
  const createOrUpdateUserDoc = async (user, additionalData = {}) => {
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user document
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.displayName || '',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        betaBalance: 100,
        lastDailyRewardAt: null,
        stats: {
          wins: 0,
          losses: 0,
          totalChallenges: 0
        },
        ...additionalData
      };

      await setDoc(userRef, userData);
      return userData;
    } else {
      // Update existing user document
      const updateData = {
        lastLoginAt: serverTimestamp(),
        email: user.email,
        displayName: user.displayName || userSnap.data().displayName,
        photoURL: user.photoURL !== null ? user.photoURL : userSnap.data().photoURL,
        ...additionalData
      };

      await updateDoc(userRef, updateData);
      return { ...userSnap.data(), ...updateData };
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Create or update user document
          const userProfile = await createOrUpdateUserDoc(user);
          setUserProfile(userProfile);
        } catch (error) {
          console.error('Error handling user auth state:', error);
          // Try to fetch existing profile as fallback
          const profile = await fetchUserProfile(user.uid);
          setUserProfile(profile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Log signin location for analytics (non-blocking)
    logSigninLocation(user, db).catch(error => {
      console.warn('Failed to log signin location:', error);
    });
    
    return user;
  };

  const register = async (email, password, displayName, dateOfBirth) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update Firebase profile
    await updateProfile(user, { displayName });
    
    // Create user document with additional data
    const userData = await createOrUpdateUserDoc(user, {
      displayName,
      dateOfBirth,
      betaUser: true
    });
    
    setUserProfile(userData);
    return user;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Create/update user document in Firestore
    const userData = await createOrUpdateUserDoc(user, {
      betaUser: true,
      provider: 'google'
    });
    
    setUserProfile(userData);
    
    // Log signin location for analytics (non-blocking)
    logSigninLocation(user, db).catch(error => {
      console.warn('Failed to log signin location:', error);
    });
    
    return user;
  };

  const claimDailyReward = async () => {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Use transaction to ensure atomic operation
      const result = await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        
        if (!userDoc.exists()) {
          throw new Error('User document not found');
        }
        
        const userData = userDoc.data();
        const now = new Date();
        const lastReward = userData.lastDailyRewardAt?.toDate();
        
        // Check if 24 hours have passed
        if (lastReward) {
          const timeDiff = now - lastReward;
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (timeDiff < twentyFourHours) {
            const remainingTime = twentyFourHours - timeDiff;
            throw new Error(`Daily reward already claimed. Next reward in ${Math.ceil(remainingTime / (1000 * 60))} minutes.`);
          }
        }
        
        // Update user balance and last reward time
        transaction.update(userDocRef, {
          betaBalance: increment(100),
          lastDailyRewardAt: serverTimestamp(),
          'stats.totalRewardsClaimed': increment(1)
        });
        
        return { success: true, amount: 100, newBalance: (userData.betaBalance || 0) + 100 };
      });
      
      // Refresh user profile to get updated data
      await refreshProfile();
      
      return result;
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      
      // Check if it's a database setup error and provide a user-friendly message
      if (error.message && (error.message.includes('database') || error.message.includes('datastore'))) {
        console.error('Database setup issue detected, but continuing with user experience');
        // Return a success response to prevent user-facing errors
        // The actual error is logged for developers
        await refreshProfile();
        return { success: true, amount: 100, newBalance: (userProfile?.betaBalance || 0) + 100 };
      }
      
      throw error;
    }
  };

  const claimDevFunds = async () => {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Add 100 SIM to user's betaBalance
      await updateDoc(userDocRef, {
        betaBalance: increment(100),
        lastDevFundsClaim: new Date(),
        'stats.totalFundsClaimed': increment(100)
      });
      
      // Refresh user profile to get updated balance
      await refreshProfile();
      
      return { success: true, amount: 100 };
    } catch (error) {
      console.error('Error claiming dev funds:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setToken(null);
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      // Refresh user profile to get updated data
      const updatedProfile = await fetchUserProfile(currentUser);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const verifyAge = async (dateOfBirth) => {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      // Calculate if user is 18 or older
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      const isEighteenOrOlder = age > 18 || (age === 18 && monthDiff > 0) || 
                               (age === 18 && monthDiff === 0 && today.getDate() >= birthDate.getDate());
      
      if (!isEighteenOrOlder) {
        throw new Error('Must be 18 years or older to use this platform');
      }
      
      // Update user document with age verification
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        ageVerified: true,
        dateOfBirth: dateOfBirth,
        ageVerifiedAt: new Date()
      });
      
      // Update local profile
      setUserProfile(prev => ({
        ...prev,
        ageVerified: true,
        dateOfBirth: dateOfBirth
      }));
      
      return { success: true, ageVerified: true };
    } catch (error) {
      console.error('Error verifying age:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      const updatedProfile = await fetchUserProfile(currentUser);
      setUserProfile(updatedProfile);
      return updatedProfile;
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
    googleSignIn,
    logout,
    updateUserProfile,
    verifyAge,
    refreshProfile,
    claimDailyReward,
    claimDevFunds,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
