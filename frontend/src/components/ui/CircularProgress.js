import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CircularProgress = ({ percentage, size = 80, strokeWidth = 8, color = '#0d6efd' }) => {
  // Use a smaller size on mobile devices
  const isMobile = window.innerWidth < 768;
  const adjustedSize = isMobile ? Math.min(size, 70) : size;
  // Calculate the circle properties
  const radius = (adjustedSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on percentage
  const getColor = (percent) => {
    if (percent < 25) return '#f44336'; // Red
    if (percent < 50) return '#ff9800'; // Orange
    if (percent < 75) return '#2196f3'; // Blue
    return '#4caf50'; // Green
  };
  
  const progressColor = color === 'auto' ? getColor(percentage) : color;
  
  return (
    <div className="circular-progress-container" style={{ position: 'relative', width: adjustedSize, height: adjustedSize, margin: '0 auto' }}>
      <svg width={adjustedSize} height={adjustedSize} viewBox={`0 0 ${adjustedSize} ${adjustedSize}`}>
        {/* Background circle */}
        <circle
          cx={adjustedSize / 2}
          cy={adjustedSize / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={adjustedSize / 2}
          cy={adjustedSize / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          transform={`rotate(-90 ${adjustedSize / 2} ${adjustedSize / 2})`}
        />
      </svg>
      
      {/* Percentage text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: adjustedSize / 4,
          fontWeight: 'bold',
          color: progressColor
        }}
      >
        {percentage}%
      </motion.div>
    </div>
  );
};

CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.string
};

export default CircularProgress;
