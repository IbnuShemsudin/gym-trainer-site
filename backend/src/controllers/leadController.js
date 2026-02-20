const Lead = require('../models/Lead');

// @desc    Create a new lead from the Hero section
// @route   POST /api/leads
// @access  Public
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, program } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const newLead = await Lead.create({
      name,
      email,
      phone,
      program: program || "General Inquiry"
    });

    res.status(201).json({
      success: true,
      message: "Welcome to the forge. We'll contact you soon.",
      data: newLead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads for the Admin Dashboard
// @route   GET /api/leads
// @access  Private (Auth Middleware required in routes)
exports.getLeads = async (req, res) => {
  try {
    // Sort by -1 to show the newest recruits first
    const leads = await Lead.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: Could not fetch leads" });
  }
};

// @desc    Delete a lead from the Dashboard
// @route   DELETE /api/leads/:id
// @access  Private (Auth Middleware required in routes)
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead purged from database"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};