// routes/profileRoutes.js
import express from 'express';
import User from '../User.js';

const router = express.Router();

// Route lấy thông tin profile (ví dụ lấy user đầu tiên)
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
