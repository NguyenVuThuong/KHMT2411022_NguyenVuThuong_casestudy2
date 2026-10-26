// Kiểm tra email có đúng dạng cơ bản "abc@xyz.com" hay không
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Middleware kiểm tra dữ liệu đăng ký
function validateRegister(req, res, next) {
  // Nếu client không gửi body JSON thì req.body có thể là undefined
  const body = req.body || {};
  const { fullName, email, password } = body;
  const errors = [];

  if (typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Họ tên phải có ít nhất 2 ký tự');
  }

  if (typeof email !== 'string' || !isValidEmail(email.trim())) {
    errors.push('Email không hợp lệ');
  }

  // bcrypt chỉ xử lý tối đa 72 ký tự đầu nên giới hạn ở đây
  if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
    errors.push('Mật khẩu phải từ 6 đến 72 ký tự');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  }

  next();
}

module.exports = { validateRegister };