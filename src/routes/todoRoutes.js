const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// Điều hướng các hành động
router.get("/", todoController.renderTodoList);
router.post("/add", todoController.addTodo);
router.post("/toggle/:id", todoController.toggleTodo);
router.post("/edit/:id", todoController.editTodo);
router.post("/delete/:id", todoController.deleteTodo);

module.exports = router;
