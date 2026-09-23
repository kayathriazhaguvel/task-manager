import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'Completed'];
const VALID_SORT_FIELDS = ['dueDate', 'priority', 'title'];

const validateTaskInput = ({ title, description, dueDate, priority, status }, { partial = false } = {}) => {
  const errors = [];

  if (!partial || title !== undefined) {
    if (!title || !title.trim()) errors.push('Title is required');
  }
  if (!partial || description !== undefined) {
    if (!description || !description.trim()) errors.push('Description is required');
  }
  if (!partial || dueDate !== undefined) {
    if (!dueDate || Number.isNaN(Date.parse(dueDate))) errors.push('A valid due date is required');
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  return errors;
};

// @route   GET /api/tasks
// @desc    Get all tasks for the logged in user - supports search, filter, sort
// @access  Private
// Query params: search, status, priority, sortBy, order (asc|desc)
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, sortBy, order } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.title = { $regex: search.trim(), $options: 'i' };
  }

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status filter. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }
    query.status = status;
  }

  if (priority) {
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority filter. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
    }
    query.priority = priority;
  }

  let sort = { createdAt: -1 };
  if (sortBy) {
    if (!VALID_SORT_FIELDS.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sortBy field. Must be one of: ${VALID_SORT_FIELDS.join(', ')}`,
      });
    }
    const direction = order === 'desc' ? -1 : 1;
    sort = { [sortBy]: direction };
  }

  const tasks = await Task.find(query).sort(sort);

  const summary = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    highPriority: tasks.filter((t) => t.priority === 'High').length,
  };

  res.status(200).json({
    success: true,
    count: tasks.length,
    summary,
    data: tasks,
  });
});

// @route   GET /api/tasks/:id
// @desc    Get a single task by id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }

  const task = await Task.findOne({ _id: id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  res.status(200).json({ success: true, data: task });
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const errors = validateTaskInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join('; ') });
  }

  const { title, description, dueDate, priority, status } = req.body;

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: task });
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (including marking Completed/Pending)
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }

  const errors = validateTaskInput(req.body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join('; ') });
  }

  const task = await Task.findOne({ _id: id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const { title, description, dueDate, priority, status } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;

  const updatedTask = await task.save();

  res.status(200).json({ success: true, data: updatedTask });
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }

  const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  res.status(200).json({ success: true, data: {} });
});
