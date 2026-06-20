const mongoose = require("mongoose");

const MembershipApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔥 CRITICAL: This tells Mongoose where to look up the ID!
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pricing",
      default: null,
    },
    tierSnapshot: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    totalPaidETB: {
      type: Number,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    receiptImageSecurePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MembershipApplication", MembershipApplicationSchema);