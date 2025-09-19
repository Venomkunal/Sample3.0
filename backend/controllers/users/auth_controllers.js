const User = require("../../models/user-model");
const bcrypt = require("bcrypt");

// 👤 User Login (any role)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = await user.generateToken();

    res.status(200).json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role, // ✅ changed from isAdmin
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Error logging in' });
  }
};

// 🔐 Admin Login Only (for backend dashboard)
const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const token = await user.generateToken();

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({ msg: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error logging in' });
  }
};
const logincheck = async (req, res) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not an admin" });
    }

    return res.json({ success: true, admin: decoded.email });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
// 📝 Register New User
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      // Optional: set default role or allow custom role
      role: 'customer', // or allow req.body.role if needed
    });

    const token = await newUser.generateToken();

    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ msg: 'Error registering user' });
  }
};

// 🚪 Logout Admin
const logout = async (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ msg: 'Failed to logout' });
  }
};

module.exports = {
  login,
  register,
  adminlogin,
  logout,
  logincheck,
};
