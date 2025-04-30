import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './PriorityIndicator.css';

const PriorityIndicator = ({ priority }) => {
  // Define colors and labels based on priority
  const priorityConfig = {
    low: {
      color: '#4caf50', // Green
      icon: 'arrow-down',
      label: 'Low'
    },
    medium: {
      color: '#2196f3', // Blue
      icon: 'minus',
      label: 'Medium'
    },
    high: {
      color: '#ff9800', // Orange
      icon: 'arrow-up',
      label: 'High'
    },
    urgent: {
      color: '#f44336', // Red
      icon: 'exclamation',
      label: 'Urgent'
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <motion.div 
      className="d-flex align-items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="priority-indicator me-2" 
        data-priority={priority}
        style={{ 
          backgroundColor: config.color,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          display: 'inline-block'
        }}
      ></div>
      <div className="d-flex align-items-center">
        <i className={`fas fa-${config.icon} me-1`} style={{ color: config.color, fontSize: '0.8rem' }}></i>
        <span style={{ color: config.color, fontWeight: '500', fontSize: '0.85rem' }}>
          {config.label}
        </span>
      </div>
    </motion.div>
  );
};

PriorityIndicator.propTypes = {
  priority: PropTypes.oneOf(['low', 'medium', 'high', 'urgent']).isRequired
};

export default PriorityIndicator;
