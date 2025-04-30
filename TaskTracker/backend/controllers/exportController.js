const Task = require('../models/Task');
const Project = require('../models/Project');

// Export tasks as CSV
exports.exportTasksCSV = async (req, res) => {
  try {
    const { projectId } = req.query;
    let tasks;
    
    // If projectId is provided, get tasks for that project
    // Otherwise, get all tasks for the user
    if (projectId) {
      // Verify project belongs to user
      const project = await Project.findOne({
        _id: projectId,
        user: req.user._id
      });
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found or does not belong to you'
        });
      }
      
      tasks = await Task.find({ project: projectId, user: req.user._id })
        .populate('project', 'title');
    } else {
      tasks = await Task.find({ user: req.user._id })
        .populate('project', 'title');
    }
    
    // Create CSV header
    let csv = 'Title,Description,Status,Project,Created Date,Completed Date\n';
    
    // Add task data to CSV
    tasks.forEach(task => {
      const createdDate = new Date(task.createdAt).toLocaleDateString();
      const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A';
      
      // Escape commas in text fields
      const title = `"${task.title.replace(/"/g, '""')}"`;
      const description = `"${task.description.replace(/"/g, '""')}"`;
      const projectTitle = `"${task.project.title.replace(/"/g, '""')}"`;
      
      csv += `${title},${description},${task.status},${projectTitle},${createdDate},${completedDate}\n`;
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=tasks-${Date.now()}.csv`);
    
    // Send CSV data
    res.status(200).send(csv);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error exporting tasks',
      error: error.message
    });
  }
};
