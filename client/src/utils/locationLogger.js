import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Utility functions for IP address and location logging
export const getIPAndLocation = async () => {
  try {
    // Use ipapi.co for IP and location data (free tier allows reasonable usage)
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP data');
    }
    
    const data = await response.json();
    
    // Return only necessary location data for analytics (privacy-conscious)
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      countryCode: data.country_code,
      timezone: data.timezone,
      latitude: data.latitude ? Math.round(data.latitude * 100) / 100 : null, // Round to ~1km precision
      longitude: data.longitude ? Math.round(data.longitude * 100) / 100 : null,
      isp: data.org || null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching IP/location data:', error);
    
    // Fallback: try to get just IP address
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      return {
        ip: ipData.ip,
        city: null,
        region: null,
        country: null,
        countryCode: null,
        timezone: null,
        latitude: null,
        longitude: null,
        isp: null,
        timestamp: new Date().toISOString(),
        fallback: true
      };
    } catch (fallbackError) {
      console.error('Error with fallback IP service:', fallbackError);
      
      // Return minimal data if both services fail
      return {
        ip: 'unknown',
        city: null,
        region: null,
        country: null,
        countryCode: null,
        timezone: null,
        latitude: null,
        longitude: null,
        isp: null,
        timestamp: new Date().toISOString(),
        error: true
      };
    }
  }
};

// Store IP/location data in Firestore (called after successful signin)
export const logSigninLocation = async (user, db) => {
  try {
    // Check if we already logged location data for this session
    const sessionKey = `signin_logged_${user.uid}_${new Date().toDateString()}`;
    if (sessionStorage.getItem(sessionKey)) {
      return; // Already logged today
    }
    
    const locationData = await getIPAndLocation();
    
    // Update user document with signin location data
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      lastSigninLocation: locationData,
      lastSigninAt: serverTimestamp()
    });
    
    // Mark as logged for this session
    sessionStorage.setItem(sessionKey, 'true');
    
    console.log('Signin location logged successfully');
  } catch (error) {
    console.error('Error logging signin location:', error);
    // Don't throw error - this shouldn't block signin process
  }
};