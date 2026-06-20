const express = require("express");
const router = express.Router();

const memberController = require("../controllers/memberController");
const Lead = require("../models/Lead");
const User = require("../models/User");
const Gallery = require("../models/Gallery");
const Pricing = require("../models/Pricing");
const MembershipApplication = require("../models/MembershipApplication");

const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

// Admin gatekeeper verification middleware
const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

/* ===================== MEMBERS ===================== */
router.get(
  "/members",
  auth,
  roleAuth(["admin", "receptionist", "trainer"]),
  memberController.getAllMembers
);

/* ===================== REQUESTS ===================== */
router.get("/requests", auth, ensureAdmin, async (req, res) => {
  try {
    // 1. Fetch pending applications and explicitly populate associated user records
    const requests = await MembershipApplication.find({ status: "pending" })
      .populate("user", "name email"); 
    
    // 2. Format documents securely for frontend interface mapping
    const formattedRequests = requests.map(reqDoc => ({
      _id: reqDoc._id,
      name: reqDoc.user?.name || "Unknown User", 
      email: reqDoc.user?.email || "No Email Provided",
      phone: reqDoc.contactPhone,
      tier: reqDoc.tierSnapshot,
      totalPaidETB: reqDoc.totalPaidETB,
      paymentProof: reqDoc.receiptImageSecurePath
    }));

    // 🔥 FIX: Wrapped back into object style matching your dashboard config (reqData?.data)
    res.json({ success: true, data: formattedRequests }); 
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/requests/:id/approve", auth, ensureAdmin, async (req, res) => {
  try {
    const application = await MembershipApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application document not found" });

    // Update registration request status state
    application.status = "approved";
    await application.save();

    // Promote corresponding user account status parameters natively
    await User.findByIdAndUpdate(application.user, { status: "approved" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/requests/:id/reject", auth, ensureAdmin, async (req, res) => {
  try {
    const application = await MembershipApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application document not found" });

    application.status = "rejected";
    await application.save();

    // Track state variations and modify database arrays accordingly
    await User.findByIdAndUpdate(application.user, { status: "rejected" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===================== LEADS ===================== */
router.get("/leads", auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/leads/:id", auth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===================== GALLERY ===================== */
router.get("/gallery", async (req, res) => {
  try {
    const data = await Gallery.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/gallery", auth, ensureAdmin, async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/gallery/:id", auth, ensureAdmin, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===================== PRICING ===================== */
router.get("/pricing", async (req, res) => {
  try {
    const data = await Pricing.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/pricing", auth, ensureAdmin, async (req, res) => {
  try {
    const item = await Pricing.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/pricing/:id", auth, ensureAdmin, async (req, res) => {
  try {
    await Pricing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;