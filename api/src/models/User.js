const mongoose = require('mongoose');

// Cấu trúc của collection "users" 
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true, // tạo unique index: không cho trùng email
      lowercase: true, // luôn lưu email dạng chữ thường
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: ''
    }
  },
  {
    // Mongoose tự thêm và cập nhật createdAt, updatedAt
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);