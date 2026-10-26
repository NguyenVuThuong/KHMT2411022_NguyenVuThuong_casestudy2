const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Chỉ trả về các trường an toàn, TUYỆT ĐỐI không trả passwordHash
function toUserResponse(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt
  };
}

// POST /api/auth/register
async function register(req, res) {
  const { fullName, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({
      status: 'error',
      message: 'Email đã được sử dụng'
    });
  }

  // 2. Băm mật khẩu (10 là độ khó của thuật toán)
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Lưu user vào MongoDB
  let user;
  try {
    user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash
    });
  } catch (error) {
    // Mã 11000 = vi phạm unique index (hai người đăng ký cùng lúc cùng email)
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'Email đã được sử dụng'
      });
    }
    throw error;
  }

  // 4. Trả kết quả
  res.status(201).json({
    status: 'success',
    message: 'Đăng ký tài khoản thành công',
    data: { user: toUserResponse(user) }
  });
}

module.exports = { register };