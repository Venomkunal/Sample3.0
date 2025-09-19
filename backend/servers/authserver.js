require("dotenv").config();
require('module-alias/register');
const authrouter = require('../routes/users/auth_routes');
const usersrouter = require('@routes/users/user_routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authConnection = require('@utils/authdb'); // this is mongoose.createConnection(...)
const express = require('express');
const app = express();
const PORT = process.env.AUTHPORT || 5003;

const allowedOrigins = [
  process.env.CUSTOMER_SITE_URL,
  process.env.ADMIN_PANEL_URL,
];
console.log('CUSTOMER_SITE_URL:', process.env.CUSTOMER_SITE_URL);
console.log('ADMIN_PANEL_URL:', process.env.ADMIN_PANEL_URL);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/auth/users", authrouter);
app.use("/users", usersrouter);

app.get("/", (req, res) => {
  res.send("Hello, auth server is working");
});

// ✅ Wait for Mongo connection before starting server
authConnection.once('open', () => {
  console.log('✅ Auth database connected');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on authentication port ${PORT}`);
  });
});

// ❌ If connection fails
authConnection.on('error', (err) => {
  console.error('❌ Failed to connect to auth database:', err);
  process.exit(1);
});

module.exports = app
