require("dotenv").config();
require('module-alias/register');
const apiServer = require('./servers/apiserver');
const authServer = require('./servers/authserver');
const uploadServer = require('./servers/uploadserver');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000


const allowedOrigins = [
  process.env.CUSTOMER_SITE_URL,  // e.g. https://your-customer-site.com
  process.env.ADMIN_PANEL_URL,     // e.g. https://admin.yourdomain.co
  process.env.TEST_URL,
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
  credentials: true, // send cookies
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
// app.use(cookieParser());
app.use(express.json());

app.use('/api',apiServer);
app.use('/auth',authServer);
app.use('/upload',uploadServer)

app.get("/" , (req,res) => {
  res.send("Hello, server is working")
  })

  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  });