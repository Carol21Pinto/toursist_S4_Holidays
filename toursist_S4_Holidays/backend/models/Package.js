const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['domestic', 'international', 'pilgrimage', 'group'], required: true },
  duration: { type: String },
  
  // Location fields
  groupType: { type: String },
  state: { type: String },
  continent: { type: String },
  
  // Pricing fields
  pricingMode: { type: String, enum: ['Structured', 'Text'], default: 'Structured' },
  pricePerPerson: { type: Number },
  currency: { type: String, default: 'INR' },
  priceNote: { type: String }, // Legacy format (pipe-separated)
  priceText: { type: String },
  
  // ✅ NEW: Categorized pricing notes
  pricingNotes: [{ type: String }], // Array of all notes
  pricingNoteCategories: {
    booking: [{ type: String }],  // Notes categorized as "Booking Policy"
    notes: [{ type: String }]     // Notes categorized as "Notes"
  },
  
  // Departure dates
  departureDates: [{ type: String }],
  
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

// ✅ PERFORMANCE BOOST: Add indexes for faster queries
PackageSchema.index({ category: 1 });
PackageSchema.index({ state: 1 });
PackageSchema.index({ continent: 1 });
PackageSchema.index({ createdAt: -1 });
PackageSchema.index({ category: 1, state: 1 });
PackageSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Package', PackageSchema);
