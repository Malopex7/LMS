const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMe,
  updateDetails,
  updateRole,
  deleteAccount
} = require('../controllers/authController');

// Get current user and update details
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

// Admin routes
router.put('/updaterole/:id', protect, updateRole);

// Delete account
router.delete('/deleteaccount', protect, deleteAccount);

module.exports = router; 