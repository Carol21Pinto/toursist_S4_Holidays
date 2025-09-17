const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['domestic', 'international', 'pilgrimage', 'group'], required: true },
  duration: { type: String }, // Added duration field
  
  // New location fields
  groupType: { type: String }, // For Group packages: "Domestic", "International", "Pilgrimage"
  state: { type: String },     // For Domestic packages  
  continent: { type: String }, // For International packages
  
  // Pricing fields
  pricingMode: { type: String, enum: ['Structured', 'Text'], default: 'Structured' }, // New field
  pricePerPerson: { type: Number }, // Removed required since Text mode won't have this
  currency: { type: String, default: 'INR' }, // Removed required, added default
  priceNote: { type: String },
  priceText: { type: String }, // New field for Text pricing mode
  
  cardImage: { type: String }, // optional
  images: [{ type: String }],
  description: { type: String, default: '' }, // Removed required, added default
  itinerary: [{
    day: Number,
    title: String,
    activities: [String]
  }],
  inclusions: [String],
  exclusions: [String],
  contactNumbers: [String],
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);
