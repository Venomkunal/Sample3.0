const express = require('express')
const authrouter = express.Router();
const authcontroller = require('../../controllers/users/auth_controllers');
const {  } = require('../../middleware/auth-middleware');


authrouter.route('/login').post(authcontroller.login);
authrouter.route('/signup').post(authcontroller.register);
authrouter.route('/admin/login').post(authcontroller.adminlogin);
authrouter.route('/users/admin/check').get(authcontroller.logincheck);
authrouter.route('/admin/logout').post(authcontroller.logout);

module.exports = authrouter;