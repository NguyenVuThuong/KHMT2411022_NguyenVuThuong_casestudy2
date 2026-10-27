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

// Middleware kiểm tra dữ liệu đăng nhập
function validateLogin(req, res, next) {
  const body = req.body || {};
  const { email, password } = body;
  const errors = [];

  if (typeof email !== 'string' || !isValidEmail(email.trim())) {
    errors.push('Email không hợp lệ');
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.push('Vui lòng nhập mật khẩu');
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

// Middleware kiểm tra dữ liệu cập nhật thông tin cá nhân
// Chỉ cho phép sửa fullName và avatarUrl; mỗi trường đều là tùy chọn
function validateUpdateProfile(req, res, next) {
  const body = req.body || {};
  const { fullName, avatarUrl } = body;
  const errors = [];

  if (fullName === undefined && avatarUrl === undefined) {
    errors.push('Cần gửi ít nhất một trường: fullName hoặc avatarUrl');
  }

  if (fullName !== undefined) {
    if (typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.push('Họ tên phải có ít nhất 2 ký tự');
    } else if (fullName.trim().length > 100) {
      errors.push('Họ tên tối đa 100 ký tự');
    }
  }

  if (avatarUrl !== undefined) {
    // Cho phép chuỗi rỗng (xóa ảnh) hoặc đường dẫn bắt đầu bằng http/https
    const isEmpty = avatarUrl === '';
    const isHttpUrl =
      typeof avatarUrl === 'string' && /^https?:\/\/\S+$/.test(avatarUrl);

    if (!isEmpty && !isHttpUrl) {
      errors.push('Đường dẫn ảnh đại diện phải bắt đầu bằng http:// hoặc https://');
    } else if (typeof avatarUrl === 'string' && avatarUrl.length > 500) {
      errors.push('Đường dẫn ảnh đại diện tối đa 500 ký tự');
    }
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

module.exports = { validateRegister, validateLogin, validateUpdateProfile };