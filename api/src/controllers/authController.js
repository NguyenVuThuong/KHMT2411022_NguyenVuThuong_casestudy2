const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Tạo token JWT chứa id của user, ký bằng JWT_SECRET trong .env
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
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

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Tìm user theo email
  const user = await User.findOne({ email: normalizedEmail });

  // 2. So sánh mật khẩu người dùng nhập với bản băm đã lưu
  const isMatch = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  // Sai email hay sai mật khẩu đều trả CÙNG một thông báo,
  // để kẻ xấu không dò ra được email nào đã đăng ký
  if (!isMatch) {
    return res.status(401).json({
      status: 'error',
      message: 'Email hoặc mật khẩu không đúng'
    });
  }

  // 3. Đúng thông tin: cấp token
  const token = signToken(user._id);

  res.json({
    status: 'success',
    message: 'Đăng nhập thành công',
    data: {
      token,
      user: toUserResponse(user)
    }
  });
}

// GET /api/auth/me  (route này đã qua middleware protect nên có req.user)
async function getMe(req, res) {
  res.json({
    status: 'success',
    data: { user: toUserResponse(req.user) }
  });
}

// PUT /api/auth/me  (cập nhật họ tên và/hoặc ảnh đại diện)
async function updateMe(req, res) {
  // Chỉ lấy đúng các trường được phép sửa, bỏ qua mọi trường khác
  // (ví dụ client gửi thêm email hay passwordHash cũng không có tác dụng)
  const updates = {};

  if (req.body.fullName !== undefined) {
    updates.fullName = req.body.fullName.trim();
  }
  if (req.body.avatarUrl !== undefined) {
    updates.avatarUrl = req.body.avatarUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true, // trả về bản ghi SAU khi cập nhật
    runValidators: true // vẫn chạy các luật kiểm tra của model
  }).select('-passwordHash');

  res.json({
    status: 'success',
    message: 'Cập nhật thông tin thành công',
    data: { user: toUserResponse(updatedUser) }
  });
}

// PUT /api/auth/change-password
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  // req.user đã bị loại passwordHash (ở middleware protect),
  // nên phải tìm lại user để lấy bản băm hiện tại
  const user = await User.findById(req.user._id);

  // 1. Kiểm tra mật khẩu hiện tại
  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    // Dùng 400 (không dùng 401) để ứng dụng không hiểu nhầm là hết phiên đăng nhập
    return res.status(400).json({
      status: 'error',
      message: 'Mật khẩu hiện tại không đúng'
    });
  }

  // 2. Băm mật khẩu mới rồi lưu
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({
    status: 'success',
    message: 'Đổi mật khẩu thành công'
  });
}

module.exports = { register, login, getMe, updateMe, changePassword };