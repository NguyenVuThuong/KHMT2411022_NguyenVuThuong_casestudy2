const express = require('express');
const {
  register,
  login,
  getMe,
  updateMe
} = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile
} = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegister, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me  (phải đăng nhập)
router.get('/me', protect, getMe);

// PUT /api/auth/me  (phải đăng nhập, dữ liệu phải hợp lệ)
router.put('/me', protect, validateUpdateProfile, updateMe);

module.exports = router;