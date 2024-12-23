const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/inotebook';
    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
  }
};

module.exports = connectToMongo;
