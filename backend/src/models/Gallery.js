const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  category: { type: String, required: true },
  label: { type: String, required: true },
  span: { type: String, default: "md:col-span-1 md:row-span-1" }
});

module.exports = mongoose.model('Gallery', gallerySchema);