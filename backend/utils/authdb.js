const mongoose = require('mongoose');

const dbURI =
  process.env.MONGODB_AUTH_URI || 'mongodb://localhost:27017/Auth';

// Detect if the URI is Atlas or Localhost
const isAtlas = dbURI.startsWith('mongodb+srv://');

// Connection options
const options = isAtlas
  ? {
      tls: true, // Atlas requires TLS
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }
  : {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    };

const authConnection = mongoose.createConnection(dbURI, options);

authConnection.on('connected', () => {
  console.log('✅ Connected to Auth database:', isAtlas ? 'Atlas' : 'Localhost');
});

authConnection.on('error', (err) => {
  console.error('❌ Failed to connect to Auth database:', err);
});

module.exports = authConnection;
