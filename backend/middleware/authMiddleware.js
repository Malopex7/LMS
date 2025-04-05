const admin = require('../config/firebase');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let firebaseToken;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      firebaseToken = req.headers.authorization.split(' ')[1];
    }

    if (!firebaseToken) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      
      // Get user from database or create if doesn't exist
      let user = await User.findOne({ email: decodedToken.email });
      
      if (!user) {
        // Create new user in our database
        user = await User.create({
          name: decodedToken.name || decodedToken.email.split('@')[0],
          email: decodedToken.email,
          // Set a dummy password since we're using Firebase auth
          password: Math.random().toString(36).slice(-8),
          role: 'student' // Default role
        });
      }

      // Add user data to request
      req.user = user;
      req.firebaseUser = decodedToken;
      next();
    } catch (error) {
      console.error('Auth Error:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
}; 