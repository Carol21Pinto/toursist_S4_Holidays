// updateAdminEmail.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function updateAdminEmail() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    const admins = await Admin.find({});
    console.log(`📊 Found ${admins.length} admin record(s)`);

    if (admins.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await Admin.create({
        email: 'fernandesashith24@gmail.com',
        password: hashedPassword
      });
      console.log('🎉 New admin created!');
      console.log('📧 Email: fernandesashith24@gmail.com');
      console.log('🔐 Password: admin123 (CHANGE THIS!)');
    } else {
      const result = await Admin.updateOne(
        { _id: admins[0]._id }, 
        { email: 'fernandesashith24@gmail.com' }
      );
      console.log('🎉 Admin email updated successfully!');
      console.log('📧 New email: fernandesashith24@gmail.com');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
}

updateAdminEmail();
