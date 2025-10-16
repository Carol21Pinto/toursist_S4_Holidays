const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Import Package model
const Package = require('./models/Package'); // Adjust path if needed

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('✅ MongoDB Connected');
  migrateImages();
}).catch(err => {
  console.error('❌ MongoDB Connection Failed:', err);
  process.exit(1);
});

async function migrateImages() {
  try {
    const packages = await Package.find();
    console.log(`📦 Found ${packages.length} packages`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (let pkg of packages) {
      // Skip if already using Cloudinary URL
      if (pkg.card_image && pkg.card_image.includes('cloudinary')) {
        console.log(`⏭️  Skipped (already migrated): ${pkg.title}`);
        skipped++;
        continue;
      }

      // Skip if no image
      if (!pkg.card_image) {
        console.log(`⏭️  Skipped (no image): ${pkg.title}`);
        skipped++;
        continue;
      }

      // Upload local image to Cloudinary
      const localPath = path.join(__dirname, pkg.card_image);

      if (!fs.existsSync(localPath)) {
        console.log(`❌ File not found: ${localPath}`);
        failed++;
        continue;
      }

      try {
        console.log(`📤 Uploading: ${pkg.title}...`);
        
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 's4holidays/packages',
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
        });

        // Update package with Cloudinary URL
        pkg.card_image = result.secure_url;
        await pkg.save();

        console.log(`✅ Migrated: ${pkg.title}`);
        console.log(`   URL: ${result.secure_url}\n`);
        migrated++;
      } catch (err) {
        console.error(`❌ Failed to migrate ${pkg.title}:`, err.message);
        failed++;
      }
    }

    console.log('\n🎉 Migration Complete!');
    console.log(`✅ Migrated: ${migrated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err);
    process.exit(1);
  }
}
