import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ size = 'medium', color = '#0d6efd', text = 'Loading...' }) => {
  // Size presets
  const sizes = {
    small: { circle: 30, container: 40 },
    medium: { circle: 50, container: 60 },
    large: { circle: 70, container: 80 }
  };
  
  const circleSize = sizes[size]?.circle || sizes.medium.circle;
  const containerSize = sizes[size]?.container || sizes.medium.container;
  
  // Animation variants
  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity
      }
    }
  };
  
  const circleVariants = {
    initial: { scale: 0 },
    animate: {
      scale: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  };
  
  // Circle positions
  const positions = [
    { top: 0, left: '50%', delay: 0 },
    { top: '25%', right: '25%', delay: 0.2 },
    { top: '50%', right: 0, delay: 0.4 },
    { bottom: '25%', right: '25%', delay: 0.6 },
    { bottom: 0, left: '50%', delay: 0.8 },
    { bottom: '25%', left: '25%', delay: 1 },
    { top: '50%', left: 0, delay: 1.2 },
    { top: '25%', left: '25%', delay: 1.4 }
  ];
  
  return (
    <div className="loading-animation-container text-center">
      <motion.div
        className="loading-spinner"
        style={{
          width: containerSize,
          height: containerSize,
          position: 'relative',
          margin: '0 auto'
        }}
        variants={containerVariants}
        animate="animate"
      >
        {positions.map((position, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              width: circleSize / 4,
              height: circleSize / 4,
              borderRadius: '50%',
              backgroundColor: color,
              ...position,
              transform: position.left ? 'translateX(-50%)' : 'translateY(-50%)'
            }}
            variants={circleVariants}
            initial="initial"
            animate="animate"
            transition={{
              delay: position.delay
            }}
          />
        ))}
      </motion.div>
      
      {text && (
        <motion.p
          className="loading-text mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingAnimation;
