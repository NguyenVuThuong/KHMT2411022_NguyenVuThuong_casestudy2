const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware bảo vệ route: chỉ cho qua khi có token hợp lệ
async function protect(req, res, next) {
  // 1. Lấy token từ header, dạng: Authorization: Bearer <token>
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Vui lòng đăng nhập để tiếp tục'
    });
  }

  const token = authHeader.slice(7).trim();

  // 2. Kiểm tra chữ ký và thời hạn của token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }

  // 3. Tìm user trong database (không lấy passwordHash)
  const user = await User.findById(decoded.id).select('-passwordHash');

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Tài khoản không còn tồn tại'
    });
  }

  // 4. Gắn user vào request để các hàm phía sau dùng
  req.user = user;
  next();
}

module.exports = { protect };