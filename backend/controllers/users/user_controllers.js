const User = require('../../models/user-model');

const getme = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
    console.log('Fetching user with ID:', req.user.userId);

  } catch (err) {
    console.error(err); //
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all users (excluding passwords)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get single user by ID (excluding password)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// ✅ Update user details (admin or regular)
const updateUser = async (req, res) => {
  try {
    const updates = req.body; // { name, email, phone, isAdmin }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, select: "-password" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getme,
};

