const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updatePriority,
  reorderTasks,
} = require("../controllers/taskController");

// Create Task
router.post("/", protect, createTask);

// Get Tasks
router.get("/", protect, getTasks);

// Reorder Tasks
router.put("/reorder", protect, reorderTasks);

// Update Task
router.put("/:id", protect, updateTask);

// Delete Task
router.delete("/:id", protect, deleteTask);

// Update Priority
router.put("/:id/priority", protect, updatePriority);

module.exports = router;