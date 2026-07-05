const db = require("../config/db");

class TodoModel {
  // Lấy danh sách công việc kết hợp lọc và tìm kiếm
  async getAll(filter = {}, search = "") {
    let sql = "SELECT * FROM todos WHERE 1=1";
    const params = [];

    // Lọc theo trạng thái
    if (filter.status === "completed") {
      sql += " AND completed = ?";
      params.push(true);
    } else if (filter.status === "active") {
      sql += " AND completed = ?";
      params.push(false);
    }

    // Tìm kiếm từ khóa theo tên công việc (Sử dụng LIKE để tìm kiếm tương đối)
    if (search && search.trim() !== "") {
      sql += " AND title LIKE ?";
      params.push(`%${search.trim()}%`);
    }

    // Sắp xếp công việc mới nhất lên đầu
    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql, params);
    return rows;
  }

  async getById(id) {
    const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async create(title) {
    const [result] = await db.query("INSERT INTO todos (title) VALUES (?)", [
      title.trim(),
    ]);
    return result.insertId; // Trả về ID của bản ghi vừa tạo
  }

  async update(id, updatedData) {
    const fields = [];
    const params = [];

    if (updatedData.title !== undefined) {
      fields.push("title = ?");
      params.push(updatedData.title.trim());
    }
    if (updatedData.completed !== undefined) {
      fields.push("completed = ?");
      params.push(updatedData.completed);
    }

    if (fields.length === 0) return false;

    // Đẩy id vào cuối mảng tham số cho mệnh đề WHERE
    params.push(id);
    const [result] = await db.query(
      `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await db.query("DELETE FROM todos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new TodoModel();
