const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['domestic', 'international', 'pilgrimage', 'group'], required: true },
  duration: { type: String },
  
  // Location fields
  groupType: { type: String }, // For Group packages: "Domestic", "International", "Pilgrimage"
  state: { type: String },     // For Domestic packages  
  continent: { type: String }, // For International packages
  
  // Pricing fields
  pricingMode: { type: String, enum: ['Structured', 'Text'], default: 'Structured' },
  pricePerPerson: { type: Number },
  currency: { type: String, default: 'INR' },
  priceNote: { type: String },
  priceText: { type: String },
  
  // NEW: Departure dates field
  departureDates: [{ type: String }], // Array of date strings
  
  cardImage: { type: String },
  images: [{ type: String }],
  description: { type: String, default: '' },
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
