const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const lastTask = await Task.findOne({ user: req.user._id })
      .sort("-priority");

    const newPriority = lastTask ? lastTask.priority + 1 : 1;
    
    const task = await Task.create({
      title,
      description,
      priority: newPriority,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS
exports.getTasks = asyncHandler(async (req, res) => {
  const {
    status,
    search,
    sort = "priority",
    order = "asc",
    page = 1,
    limit = 10,
  } = req.query;

  let query = { user: req.user._id };

  // Status filter
  if (status) {
    query.status = status;
  }

  // Search filter (title)
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const tasks = await Task.find(query)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limitNumber);

  const total = await Task.countDocuments(query);

  res.json({
    success: true,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    tasks,
  });
});

// UPDATE TASK
exports.updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;

  if (status !== undefined) {
    const allowedStatus = ["pending", "in-progress", "completed"];

    if (!allowedStatus.includes(status)) {
      res.status(400);
      throw new Error("Invalid status value");
    }

    task.status = status;
  }

  await task.save();

  res.json({
    success: true,
    task,
  });
});

// DELETE TASK
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const deletedPriority = task.priority;

  await task.deleteOne();

  await Task.updateMany(
    {
      user: req.user._id,
      priority: { $gt: deletedPriority },
    },
    { $inc: { priority: -1 } }
  );

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});
exports.updatePriority = asyncHandler(async (req, res) => {
  const { newPriority } = req.body;

  if (!Number.isInteger(newPriority)) {
    res.status(400);
    throw new Error("Invalid priority value");
  }

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const currentPriority = task.priority;

  if (newPriority === currentPriority) {
    return res.json({
      success: true,
      message: "No change needed",
    });
  }

  const maxPriority = await Task.countDocuments({
    user: req.user._id,
  });

  let finalPriority =
    newPriority > maxPriority ? maxPriority : newPriority;

  if (finalPriority < 1) finalPriority = 1;

  if (finalPriority < currentPriority) {
    await Task.updateMany(
      {
        user: req.user._id,
        priority: { $gte: finalPriority, $lt: currentPriority },
      },
      { $inc: { priority: 1 } }
    );
  } else {
    await Task.updateMany(
      {
        user: req.user._id,
        priority: { $gt: currentPriority, $lte: finalPriority },
      },
      { $inc: { priority: -1 } }
    );
  }

  task.priority = finalPriority;
  await task.save();

  res.json({
    success: true,
    message: "Priority updated successfully",
  });
});