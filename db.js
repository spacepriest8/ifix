const mongoose = require('mongoose');
const { mongoURI } = require('./config/config');  // This should correctly import mongoURI

const connectDB = async () => {
  try {
    if (!mongoURI) {
      console.error('Mongo URI is undefined');
      process.exit(1); // Exit the process if URI is not defined
    }
    console.log('Mongo URI:', mongoURI); // Debugging line
    await mongoose.connect(mongoURI); // No need for useNewUrlParser and useUnifiedTopology anymore
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;
