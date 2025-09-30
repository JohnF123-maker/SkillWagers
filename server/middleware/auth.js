const { auth } = require('../config/firebase');

// Middleware to verify Firebase JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Access token is required' 
      });
    }
    
    // Verify the token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Invalid or expired token' 
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Authentication required' 
      });
    }
    
    // Check if user has admin claim
    const userRecord = await auth.getUser(req.user.uid);
    if (!userRecord.customClaims || !userRecord.customClaims.admin) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Admin access required' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to verify admin status' 
    });
  }
};

// Middleware to check age verification (18+)
const requireAgeVerification = (req, res, next) => {
  if (!req.user.age_verified) {
    return res.status(403).json({
      error: 'Age Verification Required',
      message: 'You must be 18+ and verified to access this feature'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAgeVerification
};