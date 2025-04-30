import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNotification } from '../components/layout/NotificationSystem';
import LoadingAnimation from '../components/layout/LoadingAnimation';
import EditProjectForm from '../components/projects/EditProjectForm';
import ConfettiCelebration from '../components/ui/ConfettiCelebration';
import PriorityIndicator from '../components/ui/PriorityIndicator';
import Card3D from '../components/ui/Card3D';
import TaskTimeline from '../components/ui/TaskTimeline';
import '../components/ui/TaskTimeline.css';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(false);
  const [updatingProject, setUpdatingProject] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    status: 'todo', 
    priority: 'medium',
    dueDate: ''
  });
  const [taskFormErrors, setTaskFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { success, error: showError } = useNotification();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        // Fetch project details
        const projectRes = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(projectRes.data.data.project);
        
        // Fetch tasks for the project
        const tasksRes = await axios.get(`http://localhost:5000/api/tasks/project/${id}`);
        setTasks(tasksRes.data.data.tasks);
        
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error fetching project details';
        setError(errorMessage);
        showError(errorMessage);
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [id, showError]);

  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const validateTaskForm = () => {
    const errors = {};
    
    if (!newTask.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!newTask.description.trim()) {
      errors.description = 'Description is required';
    }
    
    return errors;
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditing(true);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowTaskForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTask(null);
    setNewTask({ 
      title: '', 
      description: '', 
      status: 'todo', 
      priority: 'medium',
      dueDate: ''
    });
    setShowTaskForm(false);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateTaskForm();
    if (Object.keys(errors).length > 0) {
      setTaskFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing && editingTask) {
        // Update existing task
        const res = await axios.patch(`http://localhost:5000/api/tasks/${editingTask._id}`, newTask);
        
        // Update task in the list
        setTasks(tasks.map(task => 
          task._id === editingTask._id ? res.data.data.task : task
        ));
        
        // Show success notification
        success('Task updated successfully!');
      } else {
        // Create new task
        const res = await axios.post('http://localhost:5000/api/tasks', {
          ...newTask,
          project: id
        });
        
        // Add new task to the list
        setTasks([...tasks, res.data.data.task]);
        
        // Show success notification
        success('Task created successfully!');
      }
      
      // Reset form
      setNewTask({ 
        title: '', 
        description: '', 
        status: 'todo', 
        priority: 'medium',
        dueDate: ''
      });
      setTaskFormErrors({});
      setShowTaskForm(false);
      setIsSubmitting(false);
      setIsEditing(false);
      setEditingTask(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error with task';
      setTaskFormErrors({ general: errorMessage });
      showError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    // Set the updating task ID to show loading state
    setUpdatingTaskId(taskId);
    
    try {
      const res = await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      
      // Update task in the list
      setTasks(tasks.map(task => 
        task._id === taskId ? res.data.data.task : task
      ));
      
      // Show success notification
      success(`Task ${newStatus === 'completed' ? 'completed' : 'moved to ' + newStatus}`);
      
      // Show confetti if task is completed
      if (newStatus === 'completed') {
        setShowConfetti(true);
        // Reset confetti after a short delay
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating task status';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      // Clear the updating task ID
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    // Set the updating task ID to show loading state
    setUpdatingTaskId(taskId);
    
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      
      // Remove task from the list
      setTasks(tasks.filter(task => task._id !== taskId));
      
      // Show success notification
      success('Task deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting task';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      // Clear the updating task ID
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      success('Project deleted successfully');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting project';
      setError(errorMessage);
      showError(errorMessage);
    }
  };
  
  const handleEditProject = () => {
    setEditingProject(true);
  };
  
  const handleCancelEditProject = () => {
    setEditingProject(false);
  };
  
  const handleUpdateProject = async (formData) => {
    setUpdatingProject(true);
    
    try {
      const res = await axios.patch(`http://localhost:5000/api/projects/${id}`, formData);
      setProject(res.data.data.project);
      setEditingProject(false);
      success('Project updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating project';
      showError(errorMessage);
    } finally {
      setUpdatingProject(false);
    }
  };

  const handleExportTasks = async () => {
    try {
      // Show loading notification
      success('Preparing CSV export...');
      
      // Make a direct request to get the CSV data
      const response = await axios.get(`http://localhost:5000/api/tasks/export/csv?projectId=${id}`, {
        responseType: 'blob' // Important for handling file downloads
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks-${project.title}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success notification
      success('Tasks exported successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error exporting tasks';
      showError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <LoadingAnimation text="Loading project details..." size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Project not found.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <motion.div 
      className="container mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ConfettiCelebration show={showConfetti} />
      {editingProject ? (
        <EditProjectForm 
          project={project} 
          onSubmit={handleUpdateProject} 
          onCancel={handleCancelEditProject} 
          isSubmitting={updatingProject} 
        />
      ) : (
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4"
          variants={itemVariants}
        >
          <h1 className="display-5 fw-bold">{project.title}</h1>
          <div>
          <motion.button
            className="btn btn-success me-2 rounded-pill"
            onClick={() => {
              if (showTaskForm && isEditing) {
                handleCancelEdit();
              } else {
                setShowTaskForm(!showTaskForm);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-plus"></i> {showTaskForm ? 'Cancel' : 'Add Task'}
          </motion.button>
          <motion.button
            className="btn btn-info me-2 rounded-pill"
            onClick={handleExportTasks}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-file-export"></i> Export Tasks
          </motion.button>
          <motion.button
            className="btn btn-info me-2 rounded-pill"
            onClick={handleEditProject}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-edit"></i> Edit Project
          </motion.button>
          <motion.button
            className="btn btn-danger rounded-pill"
            onClick={handleDeleteProject}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-trash"></i> Delete Project
          </motion.button>
        </div>
      </motion.div>
      )}

      <motion.div 
        className="card mb-4 border-0 shadow-sm"
        variants={itemVariants}
      >
        <div className="card-body p-4">
          <h5 className="card-title fw-bold">
            <i className="fas fa-info-circle me-2 text-primary"></i>
            Project Description
          </h5>
          <p className="card-text">{project.description}</p>
          <div className="text-muted">
            <i className="far fa-calendar-alt me-1"></i>
            Created on: {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>

      {/* Task Timeline Section */}
      <motion.div
        id="timeline-section"
        className="card mb-4 border-0 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="card-body p-4">
          <TaskTimeline tasks={tasks} />
        </div>
      </motion.div>

      {showTaskForm && (
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'} me-2`}></i>
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </h5>
          </div>
          <div className="card-body">
            {taskFormErrors.general && (
              <div className="alert alert-danger" role="alert">
                {taskFormErrors.general}
              </div>
            )}
            <form onSubmit={handleTaskSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Task Title
                </label>
                <input
                  type="text"
                  className={`form-control input-custom ${taskFormErrors.title ? 'is-invalid' : ''}`}
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskChange}
                  placeholder="Enter task title"
                />
                {taskFormErrors.title && (
                  <div className="invalid-feedback">{taskFormErrors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Task Description
                </label>
                <textarea
                  className={`form-control input-custom ${taskFormErrors.description ? 'is-invalid' : ''}`}
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskChange}
                  rows="3"
                  placeholder="Enter task description"
                ></textarea>
                {taskFormErrors.description && (
                  <div className="invalid-feedback">{taskFormErrors.description}</div>
                )}
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select input-custom"
                    id="status"
                    name="status"
                    value={newTask.status}
                    onChange={handleTaskChange}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="priority" className="form-label">
                    Priority
                  </label>
                  <select
                    className="form-select input-custom"
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleTaskChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  className="form-control input-custom"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleTaskChange}
                />
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <button
                    type="submit"
                    className="btn btn-gradient"
                    disabled={isSubmitting}
                  >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {isEditing ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    isEditing ? 'Update Task' : 'Add Task'
                  )}
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary ms-2" 
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                )}
              </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <h2>
          <i className="fas fa-tasks me-2 text-primary"></i>
          Tasks
        </h2>
        <div className="d-flex">
          <motion.button
            className="btn btn-outline-primary rounded-pill me-2"
            onClick={() => {
              const timelineSection = document.getElementById('timeline-section');
              if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-history me-1"></i> View Timeline
          </motion.button>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No tasks found for this project. Add your first task to get started!
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-md-4 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0 d-flex align-items-center justify-content-between">
                  <span>
                    <i className="fas fa-clipboard-list me-2 text-secondary"></i>
                    To Do
                  </span>
                  <span className="badge bg-secondary ms-2">{todoTasks.length}</span>
                </h5>
              </div>
              <div className="card-body">
                {todoTasks.length === 0 ? (
                  <p className="text-muted">No tasks in this status</p>
                ) : (
                  todoTasks.map(task => (
                    <Card3D className="mb-2" key={task._id} depth={5}>
                      <div className="card-body">
                        <h6 className="card-title">{task.title}</h6>
                        <p className="card-text small">{task.description}</p>
                        <div className="mb-2 d-flex flex-wrap align-items-center gap-2">
                          {task.priority && (
                            <PriorityIndicator priority={task.priority} />
                          )}
                          {task.dueDate && (
                            <motion.span 
                              className="badge bg-light text-dark d-flex align-items-center"
                              whileHover={{ scale: 1.05 }}
                              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                              <i className="far fa-calendar-alt me-1 text-primary"></i>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </motion.span>
                          )}
                        </div>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-sm btn-primary rounded-pill"
                            onClick={() => handleTaskStatusChange(task._id, 'in-progress')}
                            disabled={updatingTaskId === task._id}
                          >
                            {updatingTaskId === task._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                Updating...
                              </>
                            ) : (
                              <>Move to In Progress</>
                            )}
                          </button>
                          <div>
                            <button
                              className="btn btn-sm btn-info rounded-circle me-1"
                              onClick={() => handleEditTask(task)}
                              disabled={updatingTaskId === task._id}
                              title="Edit task"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger rounded-circle"
                              onClick={() => handleDeleteTask(task._id)}
                              disabled={updatingTaskId === task._id}
                              title="Delete task"
                            >
                              {updatingTaskId === task._id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card3D>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0 d-flex align-items-center justify-content-between">
                  <span>
                    <i className="fas fa-spinner me-2"></i>
                    In Progress
                  </span>
                  <span className="badge bg-light text-dark ms-2">{inProgressTasks.length}</span>
                </h5>
              </div>
              <div className="card-body">
                {inProgressTasks.length === 0 ? (
                  <p className="text-muted">No tasks in this status</p>
                ) : (
                  inProgressTasks.map(task => (
                    <Card3D className="mb-2" key={task._id} depth={5}>
                      <div className="card-body">
                        <h6 className="card-title">{task.title}</h6>
                        <p className="card-text small">{task.description}</p>
                        <div className="mb-2 d-flex flex-wrap align-items-center gap-2">
                          {task.priority && (
                            <PriorityIndicator priority={task.priority} />
                          )}
                          {task.dueDate && (
                            <motion.span 
                              className="badge bg-light text-dark d-flex align-items-center"
                              whileHover={{ scale: 1.05 }}
                              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                              <i className="far fa-calendar-alt me-1 text-primary"></i>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </motion.span>
                          )}
                        </div>
                        <div className="d-flex justify-content-between">
                          <div>
                            <button
                              className="btn btn-sm btn-secondary me-1 rounded-pill"
                              onClick={() => handleTaskStatusChange(task._id, 'todo')}
                              disabled={updatingTaskId === task._id}
                            >
                              {updatingTaskId === task._id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                  Updating...
                                </>
                              ) : (
                                <>Move to To Do</>
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-success rounded-pill"
                              onClick={() => handleTaskStatusChange(task._id, 'completed')}
                              disabled={updatingTaskId === task._id}
                            >
                              {updatingTaskId === task._id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                  Updating...
                                </>
                              ) : (
                                <>Complete</>
                              )}
                            </button>
                          </div>
                          <div>
                            <button
                              className="btn btn-sm btn-info rounded-circle me-1"
                              onClick={() => handleEditTask(task)}
                              disabled={updatingTaskId === task._id}
                              title="Edit task"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger rounded-circle"
                              onClick={() => handleDeleteTask(task._id)}
                              disabled={updatingTaskId === task._id}
                              title="Delete task"
                            >
                              {updatingTaskId === task._id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card3D>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Completed ({completedTasks.length})</h5>
              </div>
              <div className="card-body">
                {completedTasks.length === 0 ? (
                  <p className="text-muted">No tasks in this status</p>
                ) : (
                  completedTasks.map(task => (
                    <Card3D className="mb-2" key={task._id} depth={5}>
                      <div className="card-body">
                        <h6 className="card-title">{task.title}</h6>
                        <p className="card-text small">{task.description}</p>
                        <div className="mb-2 d-flex flex-wrap align-items-center gap-2">
                          {task.priority && (
                            <PriorityIndicator priority={task.priority} />
                          )}
                          {task.dueDate && (
                            <motion.span 
                              className="badge bg-light text-dark d-flex align-items-center"
                              whileHover={{ scale: 1.05 }}
                              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                              <i className="far fa-calendar-alt me-1 text-primary"></i>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </motion.span>
                          )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Completed: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}
                          </small>
                          <div>
                            <button
                              className="btn btn-sm btn-warning me-1"
                              onClick={() => handleTaskStatusChange(task._id, 'in-progress')}
                            >
                              Reopen
                            </button>
                            <button
                              className="btn btn-sm btn-danger rounded-circle"
                              onClick={() => handleDeleteTask(task._id)}
                              disabled={updatingTaskId === task._id}
                            >
                              {updatingTaskId === task._id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card3D>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <motion.div 
        className="mt-4"
        variants={itemVariants}
      >
        <motion.button 
          className="btn btn-secondary rounded-pill"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Dashboard
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetails;
