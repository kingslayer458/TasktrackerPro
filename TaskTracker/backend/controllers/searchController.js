const Task = require('../models/Task');
const Project = require('../models/Project');

// Search tasks by title or description
exports.searchTasks = async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    // Create a regex pattern for case-insensitive search
    const searchPattern = new RegExp(term, 'i');

    // Find tasks matching the search term in title or description
    // Only return tasks that belong to the current user
    const tasks = await Task.find({
      user: req.user._id,
      $or: [
        { title: searchPattern },
        { description: searchPattern }
      ]
    }).populate({
      path: 'project',
      select: 'title'
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
      message: 'Error searching tasks',
      error: error.message
    });
  }
};
