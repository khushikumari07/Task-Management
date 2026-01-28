require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/task-management';

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB Connection Failed (Server still running in development mode)');
    console.warn('   To use database features, configure MongoDB:');
    console.warn('   1. Install MongoDB locally, OR');
    console.warn('   2. Create MongoDB Atlas account and update .env');
    console.warn('   Current URI attempted:', process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management');
    return false;
  }
};

module.exports = connectDB;
