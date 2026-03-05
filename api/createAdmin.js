require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); 

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // We will use "ethiofit" in the email field so the logic works
    const loginID = "ethiofit"; 
    const password = "Password123"; 

    // Clear old users to prevent "Email already exists" errors
    await User.deleteMany({ email: loginID });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name: "Elite Admin",
      email: loginID, 
      password: hashedPassword,
    });

    await admin.save();
    console.log(`✅ DATABASE READY`);
    console.log(`ID: ${loginID} | PW: ${password}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
createAdmin();