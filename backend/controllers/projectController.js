const Project = require('../models/Project');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    // Check if user has reached the project limit (4)
    const hasReachedLimit = await Project.checkProjectLimit(req.user._id);
    if (hasReachedLimit) {
      return res.status(400).json({
        success: false,
        message: 'You have reached the maximum limit of 4 projects'
      });
    }

    // Create new project
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: {
        project: newProject
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Get all projects for the current user
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      results: projects.length,
      data: {
        projects
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get a single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('tasks');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(204).json({
      success: true,
      data: null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};
