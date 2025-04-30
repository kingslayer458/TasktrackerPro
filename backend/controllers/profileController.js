const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, country, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic profile information
    user.name = name || user.name;
    user.country = country || user.country;

    // If user is trying to update password
    if (newPassword) {
      // Check if current password is correct
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required'
        });
      }

      const isMatch = await user.correctPassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Set new password
      user.password = newPassword;
    }

    // Save updated user
    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate project and task statistics
    const stats = {
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0
    };

    // Get projects count from Project model
    const Project = require('../models/Project');
    const Task = require('../models/Task');

    // Count projects
    stats.totalProjects = await Project.countDocuments({ user: userId });

    // Count tasks and their statuses
    const tasks = await Task.find({ user: userId });
    stats.totalTasks = tasks.length;
    
    // Count tasks by status
    tasks.forEach(task => {
      if (task.status === 'completed') {
        stats.completedTasks++;
      } else if (task.status === 'in-progress') {
        stats.inProgressTasks++;
      } else if (task.status === 'todo') {
        stats.todoTasks++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};
