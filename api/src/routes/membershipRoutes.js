const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); 
const fs = require("fs");     
const auth = require("../middleware/auth"); 
const MembershipApplication = require("../models/MembershipApplication");

// Dynamically target the exact folder within the backend directory
const uploadDir = path.resolve(__dirname, "../../src/uploads/receipts");

// Verify folder structure exists safely
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set disk storage allocation structure
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// POST Submissions Route Endpoint
// src/routes/membershipRoutes.js

router.post("/apply", auth, upload.single("paymentProof"), async (req, res) => {
  try {
    // FALLBACK SAFETY: Read fields from body regardless of header configuration variations
    const { tier, program, durationMonths, totalPaidETB, contactPhone, planId } = req.body;

    // Check if the file successfully hit the Multer storage processor
    if (!req.file) {
      console.log("Multer intercept failed. Request body content received:", req.body);
      return res.status(400).json({ 
        error: "Missing physical receipt screenshot asset artifact.",
        tip: "Ensure your form boundary configuration is entirely handled by the client engine browser natively."
      });
    }

    // Save configurations cleanly to MongoDB Atlas database mapping
    const newApplication = await MembershipApplication.create({
      user: req.user.id, 
      plan: planId || null, 
      tierSnapshot: tier,   
      program,
      durationMonths: Number(durationMonths),
      totalPaidETB: Number(totalPaidETB),
      contactPhone,
      receiptImageSecurePath: `/uploads/receipts/${req.file.filename}`, 
      status: "pending" 
    });

    res.status(201).json({ 
      success: true, 
      message: "Application logged successfully inside database arrays.",
      applicationId: newApplication._id 
    });

  } catch (error) {
    console.error("Subscription runtime failure:", error);
    res.status(500).json({ error: "Internal server structural state exception." });
  }
});

module.exports = router;