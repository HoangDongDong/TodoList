const express = require("express");
const path = require("path");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình View Engine là EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware xử lý dữ liệu từ Form (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Sử dụng định tuyến cho Todo
app.use("/", todoRoutes);

// Xử lý lỗi 404 cho các route không tồn tại
app.use((req, res) => {
  res.status(404).send("<h1>404 - Không tìm thấy trang yêu cầu</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
