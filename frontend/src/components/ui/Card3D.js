import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Card3D = ({ children, className = '', depth = 10 }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation (limited to small angles)
    const rotateXValue = (mouseY / (rect.height / 2)) * -depth;
    const rotateYValue = (mouseX / (rect.width / 2)) * depth;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setScale(1.02);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };
  
  const handleTouchStart = () => {
    if (isMobile) {
      setScale(1.02);
    }
  };
  
  const handleTouchEnd = () => {
    if (isMobile) {
      setScale(1);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`card3d ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        willChange: 'transform'
      }}
      animate={{
        rotateX: `${rotateX}deg`,
        rotateY: `${rotateY}deg`,
        scale: scale,
        boxShadow: scale > 1 
          ? `
              0 ${5 + Math.abs(rotateY) / 2}px ${10 + Math.abs(rotateX)}px rgba(0,0,0,0.1),
              0 ${2 + Math.abs(rotateY) / 4}px ${5 + Math.abs(rotateX) / 2}px rgba(0,0,0,0.05)
            `
          : '0 2px 10px rgba(0,0,0,0.1)'
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </motion.div>
  );
};

Card3D.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  depth: PropTypes.number
};

export default Card3D;
