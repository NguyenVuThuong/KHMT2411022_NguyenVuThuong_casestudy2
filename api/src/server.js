
require('dotenv').config();

const express = require('express');
const connectDatabase = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API kiểm tra trạng thái server
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running!',
    status: 'success'
  });
});

// Kết nối database trước khi mở server
async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
