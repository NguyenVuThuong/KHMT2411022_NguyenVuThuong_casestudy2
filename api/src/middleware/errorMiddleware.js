// Xử lý khi người dùng gọi một đường dẫn không tồn tại
function notFound(req, res, next) {
  res.status(404).json({
    status: 'error',
    message: `Không tìm thấy đường dẫn: ${req.method} ${req.originalUrl}`
  });
}

// Xử lý mọi lỗi phát sinh trong ứng dụng (phải có đủ 4 tham số)
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // Ghi chi tiết lỗi ở terminal của server để mình đọc
  console.error('Lỗi:', err.message);

  // Với lỗi 500 (lỗi hệ thống), không trả chi tiết cho client
  const message =
    statusCode === 500 ? 'Lỗi máy chủ, vui lòng thử lại sau' : err.message;

  res.status(statusCode).json({
    status: 'error',
    message
  });
}

module.exports = { notFound, errorHandler };