# TodoList

Ứng dụng quản lý công việc đơn giản dùng **Node.js**, **Express**, **EJS** và **MySQL**.

## Cài đặt

1. Cài dependencies:

```bash
npm install
```

2. Tạo file `.env` ở thư mục gốc và khai báo thông tin kết nối database(trong project đã có sẵn):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todolist
PORT=3001
```

3. Tạo database và bảng `todos`:

```sql
CREATE DATABASE IF NOT EXISTS todolist;
USE todolist;

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);
```

## Chạy ứng dụng

```bash
npm start
```

Mặc định ứng dụng sẽ chạy tại:

```text
http://localhost:3001
```

## Chức năng

- Thêm công việc mới
- Sửa tên công việc
- Đánh dấu hoàn thành / chưa hoàn thành
- Xóa công việc
- Lọc theo trạng thái
- Tìm kiếm theo tiêu đề

## Cấu trúc thư mục

```text
src/
  app.js
  config/db.js
  controllers/todoController.js
  models/TodoModel.js
  routes/todoRoutes.js
views/
  index.ejs
```
