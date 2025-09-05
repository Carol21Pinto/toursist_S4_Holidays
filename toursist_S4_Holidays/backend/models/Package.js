const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['domestic', 'international', 'pilgrimage', 'group'], required: true },
  pricePerPerson: { type: Number, required: true },
  currency: { type: String, required: true },
  priceNote: { type: String },
  cardImage: { type: String }, // optional
  images: [{ type: String }],
  description: { type: String, required: true },
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
