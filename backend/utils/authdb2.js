const mongoose = require('mongoose');

function connectAuthDB() {
  const dbURI = process.env.MONGODB_AUTH_URI || 'mongodb://localhost:27017/Auth';

  const authConnection = mongoose.createConnection(dbURI, {
    tls: true, // Required for MongoDB Atlas
  });

  authConnection.on('connected', () => {
    console.log('✅ Connected to Auth database');
  });

  authConnection.on('error', (err) => {
    console.error('❌ Failed to connect to Auth database:', err);
  });

  return authConnection;
}

module.exports = connectAuthDB;
