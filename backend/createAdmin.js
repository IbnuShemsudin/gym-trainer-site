require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Paste your User Model path here
const User = require('./src/models/User'); 

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // CHANGE THESE TO YOUR DESIRED LOGIN DETAILS
    const adminEmail = "admin@sweatbox.com";
    const adminPassword = "ElitePassword123"; 

    // Check if user exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log("Admin already exists!");
      process.exit();
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Save to MongoDB
    const admin = new User({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
    });

    await admin.save();
    console.log(`✅ Admin Created! \nEmail: ${adminEmail} \nPassword: ${adminPassword}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();