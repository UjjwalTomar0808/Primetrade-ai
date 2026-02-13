import Task from "../models/Task.js";
import {
  ApiError,
  asyncHandler,
  successResponse,
} from "../helpers/error.helper.js";
import {
  isValidObjectId,
  sanitizeInput,
} from "../helpers/validation.helper.js";

/**
 * @desc    Get all tasks for logged-in user
 * @route   GET /api/v1/tasks
 * @access  Private
 */
export const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, priority, search, sortBy = "createdAt", order = "desc" } =
    req.query;

  // Build query
  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort
  const sort = {};
  sort[sortBy] = order === "asc" ? 1 : -1;

  // Execute query
  const tasks = await Task.find(query).sort(sort);

  return successResponse(res, 200, "Tasks fetched successfully", {
    count: tasks.length,
    tasks,
  });
});

/**
 * @desc    Get single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await Task.findOne({ _id: id, user: userId });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return successResponse(res, 200, "Task fetched successfully", { task });
});

/**
 * @desc    Create new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, tags } = req.body;
  const userId = req.user._id;

  if (!title) {
    throw new ApiError(400, "Task title is required");
  }

  const taskData = {
    title: sanitizeInput(title),
    user: userId,
  };

  if (description) {
    taskData.description = sanitizeInput(description);
  }

  if (status) {
    if (!["pending", "in-progress", "completed"].includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }
    taskData.status = status;
    taskData.completed = status === "completed";
    if (status === "completed") {
      taskData.completedAt = new Date();
    }
  }

  if (priority) {
    if (!["low", "medium", "high"].includes(priority)) {
      throw new ApiError(400, "Invalid priority value");
    }
    taskData.priority = priority;
  }

  if (dueDate) {
    taskData.dueDate = new Date(dueDate);
  }

  if (tags && Array.isArray(tags)) {
    taskData.tags = tags;
  }

  const task = await Task.create(taskData);

  return successResponse(res, 201, "Task created successfully", { task });
});

/**
 * @desc    Update task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate, tags } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid task ID");
  }

  // Find task
  const task = await Task.findOne({ _id: id, user: userId });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Build updates
  const updates = {};

  if (title !== undefined) {
    updates.title = sanitizeInput(title);
  }

  if (description !== undefined) {
    updates.description = sanitizeInput(description);
  }

  if (status !== undefined) {
    if (!["pending", "in-progress", "completed"].includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }
    updates.status = status;
    updates.completed = status === "completed";
    if (status === "completed" && !task.completed) {
      updates.completedAt = new Date();
    } else if (status !== "completed") {
      updates.completedAt = null;
    }
  }

  if (priority !== undefined) {
    if (!["low", "medium", "high"].includes(priority)) {
      throw new ApiError(400, "Invalid priority value");
    }
    updates.priority = priority;
  }

  if (dueDate !== undefined) {
    updates.dueDate = dueDate ? new Date(dueDate) : null;
  }

  if (tags !== undefined && Array.isArray(tags)) {
    updates.tags = tags;
  }

  // Update task
  const updatedTask = await Task.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  return successResponse(res, 200, "Task updated successfully", {
    task: updatedTask,
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await Task.findOneAndDelete({ _id: id, user: userId });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return successResponse(res, 200, "Task deleted successfully", null);
});

/**
 * @desc    Get task statistics
 * @route   GET /api/v1/tasks/stats
 * @access  Private
 */
export const getTaskStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await Task.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
        },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
        },
        mediumPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] },
        },
        lowPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] },
        },
      },
    },
  ]);

  const result = stats[0] || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  };

  return successResponse(res, 200, "Task statistics fetched successfully", {
    stats: result,
  });
});
