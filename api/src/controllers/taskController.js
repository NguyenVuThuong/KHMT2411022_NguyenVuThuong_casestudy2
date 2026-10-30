const Task = require('../models/Task');
const { parseOptionalDate } = require('../validators/taskValidator');

// Chuẩn hóa dữ liệu công việc trả về cho client
function toTaskResponse(task) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    createdBy: task.createdBy,
    assigneeIds: task.assigneeIds,
    primaryAssigneeId: task.primaryAssigneeId,
    startDate: task.startDate,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

// POST /api/tasks
async function createTask(req, res) {
  const { title, description, startDate, dueDate, priority, status } = req.body;

  const task = await Task.create({
    title: title.trim(),
    description: description ? description.trim() : '',
    // Người tạo lấy từ token đã xác thực, KHÔNG lấy từ body
    createdBy: req.user._id,
    startDate: parseOptionalDate(startDate),
    dueDate: parseOptionalDate(dueDate),
    // Nếu client không gửi thì dùng giá trị mặc định của model
    priority,
    status
  });

  res.status(201).json({
    status: 'success',
    message: 'Tạo công việc thành công',
    data: { task: toTaskResponse(task) }
  });
}

// GET /api/tasks
async function getTasks(req, res) {
  // Giai đoạn 4: chỉ trả công việc do chính người dùng tạo.
  // Giai đoạn 5 sẽ mở rộng thêm công việc được giao và được chia sẻ.
  const tasks = await Task.find({ createdBy: req.user._id }).sort({
    createdAt: -1 // mới nhất lên đầu
  });

  res.json({
    status: 'success',
    data: {
      count: tasks.length,
      tasks: tasks.map(toTaskResponse)
    }
  });
}

module.exports = { createTask, getTasks, toTaskResponse };