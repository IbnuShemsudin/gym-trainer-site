require('dotenv').config();
const mongoose = require('mongoose');
const Gallery = require('./src/models/Gallery');

const images = [
  { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48", category: "Gym", label: "Elite Iron", span: "md:col-span-2 md:row-span-2" },
  { url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed", category: "Boxing", label: "Power Punch", span: "md:col-span-1 md:row-span-1" },
  { url: "https://images.unsplash.com/photo-1552196564-97c84853752e", category: "Yoga", label: "Zen Flow", span: "md:col-span-1 md:row-span-2" },
  { url: "https://images.unsplash.com/photo-1594381898411-846e7d193883", category: "Boxing", label: "Speed Work", span: "md:col-span-2 md:row-span-1" }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Gallery.deleteMany({});
    await Gallery.insertMany(images);
    console.log("✅ Gallery Seeded Successfully!");
    process.exit();
  });