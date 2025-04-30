const Task = require('../models/Task');
const Project = require('../models/Project');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({
      _id: req.body.project,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or does not belong to you'
      });
    }

    // Create new task
    const newTask = await Task.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: {
        task: newTask
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// Get all tasks for a specific project
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
      user: req.user._id
    });

    res.status(200).json({
      success: true,
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        task
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task fields
    Object.keys(req.body).forEach(key => {
      task[key] = req.body[key];
    });

    await task.save();

    res.status(200).json({
      success: true,
      data: {
        task
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(204).json({
      success: true,
      data: null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};
