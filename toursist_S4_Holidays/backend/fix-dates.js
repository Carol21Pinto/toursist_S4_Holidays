require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('./models/Package');

async function fixDates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const result = await Package.updateMany(
      { 
        $or: [
          { createdAt: { $exists: false } },
          { createdAt: null }
        ]
      },
      { 
        $set: { createdAt: new Date() } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} packages with createdAt`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixDates();
