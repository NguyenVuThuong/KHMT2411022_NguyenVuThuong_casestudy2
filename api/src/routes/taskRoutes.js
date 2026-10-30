const express = require('express');
const { createTask, getTasks } = require('../controllers/taskController');
const { validateCreateTask } = require('../validators/taskValidator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Mọi API công việc đều yêu cầu đăng nhập
router.use(protect);

// GET /api/tasks
router.get('/', getTasks);

// POST /api/tasks
router.post('/', validateCreateTask, createTask);

module.exports = router;