const todoModel = require("../models/TodoModel");

function getSafeReturnTo(req) {
  const { returnTo } = req.body || {};

  if (typeof returnTo !== "string" || returnTo.trim() === "") {
    return "/";
  }

  const trimmed = returnTo.trim();

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  return "/";
}

exports.renderTodoList = async (req, res) => {
  try {
    const { status, search } = req.query;
    const todos = await todoModel.getAll({ status }, search);

    res.render("index", {
      todos,
      currentStatus: status || "all",
      currentSearch: search || "",
      currentUrl: req.originalUrl,
      error: req.query.error || null,
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách:", err);
    res.status(500).send("Lỗi máy chủ nội bộ khi tải dữ liệu.");
  }
};

exports.addTodo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.redirect(
        "/?error=" +
          encodeURIComponent("Tiêu đề công việc không được để trống!"),
      );
    }

    await todoModel.create(title);
    res.redirect("/");
  } catch (err) {
    console.error("Lỗi thêm công việc:", err);
    res.redirect(
      "/?error=" +
        encodeURIComponent("Không thể thêm công việc do lỗi hệ thống."),
    );
  }
};

exports.toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.getById(id);

    if (!todo) {
      return res.redirect(
        "/?error=" + encodeURIComponent("Công việc không tồn tại!"),
      );
    }

    // Đảo ngược trạng thái completed (0 thành 1, hoặc 1 thành 0 trong MySQL)
    await todoModel.update(id, { completed: !todo.completed });
    res.redirect("/");
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.redirect(
      "/?error=" + encodeURIComponent("Lỗi khi cập nhật trạng thái."),
    );
  }
};

exports.editTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.redirect(
        "/?error=" +
          encodeURIComponent("Tên công việc chỉnh sửa không hợp lệ!"),
      );
    }

    const success = await todoModel.update(id, { title });
    if (!success) {
      return res.redirect(
        "/?error=" +
          encodeURIComponent("Không tìm thấy công việc để chỉnh sửa!"),
      );
    }

    res.redirect("/");
  } catch (err) {
    console.error("Lỗi sửa tiêu đề:", err);
    res.redirect(
      "/?error=" + encodeURIComponent("Lỗi khi chỉnh sửa tên công việc."),
    );
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const returnTo = getSafeReturnTo(req);
    const success = await todoModel.delete(id);

    if (!success) {
      return res.redirect(
        `${returnTo}${returnTo.includes("?") ? "&" : "?"}error=${encodeURIComponent("Không thể xóa. Công việc không tồn tại!")}`,
      );
    }

    res.redirect(returnTo);
  } catch (err) {
    console.error("Lỗi xóa công việc:", err);
    res.redirect(
      "/?error=" + encodeURIComponent("Lỗi hệ thống không thể xóa bản ghi."),
    );
  }
};
