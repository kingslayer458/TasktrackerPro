import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const TaskTimeline = ({ tasks }) => {
  // Filter only completed tasks with completedAt date
  const completedTasks = tasks
    .filter(task => task.status === 'completed' && task.completedAt)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
  
  if (completedTasks.length === 0) {
    return (
      <div className="text-center text-muted p-4">
        <i className="fas fa-history fa-2x mb-3"></i>
        <p>No completed tasks yet. Complete a task to see your timeline!</p>
      </div>
    );
  }
  
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <motion.div 
      className="task-timeline"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h5 className="mb-4">
        <i className="fas fa-history me-2 text-primary"></i>
        Task Completion Timeline
      </h5>
      
      <div className="timeline-container">
        {completedTasks.map((task, index) => (
          <motion.div 
            key={task._id} 
            className="timeline-item mb-4 position-relative"
            variants={itemVariants}
          >
            <div className="timeline-marker"></div>
            <div className="timeline-content card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">{task.title}</h6>
                  <span className="badge bg-success">Completed</span>
                </div>
                <p className="text-muted small mb-2">{task.description}</p>
                <div className="text-end">
                  <small className="text-muted">
                    <i className="far fa-clock me-1"></i>
                    {formatDate(task.completedAt)}
                  </small>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

TaskTimeline.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default TaskTimeline;
