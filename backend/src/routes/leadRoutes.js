const express = require('express');
const router = express.Router();

// 1. Import the controller functions
const { createLead, getLeads } = require('../controllers/leadController');

// 2. Import the "Guard" middleware
const auth = require('../middleware/auth');

/**
 * @route   POST /api/leads
 * @desc    Submit a new lead (Public - used by Hero section)
 */
router.post('/', createLead);

/**
 * @route   GET /api/leads
 * @desc    View all leads (Private - used by Admin Dashboard)
 * @access  Protected (Requires valid JWT token)
 */
router.get('/', auth, getLeads);

module.exports = router;