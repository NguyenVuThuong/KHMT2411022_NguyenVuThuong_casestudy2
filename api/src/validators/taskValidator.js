const { PRIORITIES, STATUSES } = require('../models/Task');

// Đổi giá trị gửi lên thành Date. Trả về:
//   null     nếu không có ngày (undefined, null hoặc chuỗi rỗng)
//   Date     nếu hợp lệ
//   undefined nếu sai định dạng
function parseOptionalDate(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (typeof value !== 'string') {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// Middleware kiểm tra dữ liệu khi tạo công việc
function validateCreateTask(req, res, next) {
  const body = req.body || {};
  const { title, description, startDate, dueDate, priority, status } = body;
  const errors = [];

  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Tên công việc là bắt buộc');
  } else if (title.trim().length > 200) {
    errors.push('Tên công việc tối đa 200 ký tự');
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('Mô tả phải là chuỗi ký tự');
    } else if (description.length > 2000) {
      errors.push('Mô tả tối đa 2000 ký tự');
    }
  }

  const start = parseOptionalDate(startDate);
  const due = parseOptionalDate(dueDate);

  if (start === undefined) {
    errors.push('Ngày bắt đầu không hợp lệ');
  }
  if (due === undefined) {
    errors.push('Hạn hoàn thành không hợp lệ');
  }
  // Chỉ so sánh khi cả hai ngày đều có và hợp lệ
  if (start && due && due < start) {
    errors.push('Hạn hoàn thành không được trước ngày bắt đầu');
  }

  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    errors.push(`Mức độ ưu tiên phải là một trong: ${PRIORITIES.join(', ')}`);
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    errors.push(`Trạng thái phải là một trong: ${STATUSES.join(', ')}`);
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

module.exports = { validateCreateTask, parseOptionalDate };