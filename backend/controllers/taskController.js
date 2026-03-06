const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

// COUMMN PRIORITY
async function fixColumnPriorities(userId, status) {

  const tasks = await Task.find({
    user: userId,
    status: status
  }).sort("priority");

  for (let i = 0; i < tasks.length; i++) {
    tasks[i].priority = i + 1;
    await tasks[i].save();
  }

}

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const lastTask = await Task.findOne({
  user: req.user._id,
  status: "pending"
}).sort("-priority");

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

exports.updateTask = async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldStatus = task.status;

    if (req.body.status) {
      task.status = req.body.status;
    }

    await task.save();

    await fixColumnPriorities(req.user._id, oldStatus);
    await fixColumnPriorities(req.user._id, task.status);

    res.json(task);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: error.message });

  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await fixColumnPriorities(req.user._id, task.status);

    res.json({ message: "Task deleted" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: error.message });

  }

};

// UPDATE PRIORITY
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
    status: task.status,
  });

  let finalPriority =
    newPriority > maxPriority ? maxPriority : newPriority;

  if (finalPriority < 1) finalPriority = 1;

  if (finalPriority < currentPriority) {
    await Task.updateMany(
      {
        user: req.user._id,
        status: task.status,
        priority: { $gte: finalPriority, $lt: currentPriority },
      },
      { $inc: { priority: 1 } }
    );
  } else {
    await Task.updateMany(
      {
        user: req.user._id,
        status: task.status,
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

// REORDER TASKS 
exports.reorderTasks = async (req, res) => {
  try {

    const statuses = ["pending", "inprogress", "completed"];

    for (const status of statuses) {

      const tasks = await Task.find({
        user: req.user._id,
        status: status
      }).sort("priority");

      for (let i = 0; i < tasks.length; i++) {

        tasks[i].priority = i + 1;
        await tasks[i].save();

      }

    }

    res.json({ message: "Priorities reordered per column" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: error.message });

  }
};