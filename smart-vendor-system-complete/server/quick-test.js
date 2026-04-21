require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing Configuration:');
console.log('========================');
console.log('PORT:', process.env.PORT);
console.log('MongoDB:', process.env.MONGO_URI);
console.log('JWT Secret:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('Email User:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('Email Pass:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('========================');

// Test MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connection Successful');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
  });