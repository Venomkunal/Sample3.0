const mongoose = require('mongoose');

const atlasURI = process.env.MONGODB_PRODUCT_URI; // Atlas URI (if provided)
const localURI = 'mongodb://localhost:27017/Products';

// Pick primary URI (Atlas if env is set, otherwise local)
const primaryURI = atlasURI || localURI;

// Detect if it's Atlas
const isAtlas = primaryURI.startsWith('mongodb+srv://');

// Options for Atlas vs Local
const atlasOptions = {
  tls: true,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

const localOptions = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

// Start connection
let productConnection = mongoose.createConnection(primaryURI, isAtlas ? atlasOptions : localOptions);

productConnection.on('connected', () => {
  console.log(`✅ Connected to Product database (${isAtlas ? 'Atlas' : 'Localhost'})`);
});

productConnection.on('error', (err) => {
  console.error(`❌ Failed to connect to ${isAtlas ? 'Atlas' : 'Localhost'} Product DB:`, err);

  // If Atlas fails, try Localhost as fallback
  if (isAtlas) {
    console.log('🔄 Falling back to Localhost Product DB...');
    productConnection = mongoose.createConnection(localURI, localOptions);

    productConnection.on('connected', () => {
      console.log('✅ Connected to Product database (Localhost fallback)');
    });

    productConnection.on('error', (err) => {
      console.error('❌ Failed to connect to Localhost Product DB as fallback:', err);
    });
  }
});

module.exports = productConnection;


