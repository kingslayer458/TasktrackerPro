import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    // Array of loading messages
    const loadingMessages = [
      'Initializing...',
      'Loading your tasks...',
      'Preparing your workspace...',
      'Almost there...',
      'Ready to go!'
    ];

    // Simulate loading progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress += 5;
        setProgress(currentProgress);
        
        // Update loading text based on progress
        const messageIndex = Math.floor(currentProgress / 25);
        if (messageIndex < loadingMessages.length) {
          setLoadingText(loadingMessages[messageIndex]);
        }
      } else {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 500);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const logoVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const dotVariants = {
    hidden: { y: 0 },
    visible: { 
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="preloader"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="preloader"
      >
        <div className="preloader-content">
          <motion.div
            className="logo-container"
            variants={logoVariants}
          >
            <motion.i 
              className="fas fa-tasks preloader-icon"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
                filter: [
                  'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))',
                  'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))',
                  'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))'
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <motion.h1 
              className="preloader-title"
              variants={logoVariants}
            >
              TaskMaster Pro
            </motion.h1>
            <motion.p 
              className="preloader-subtitle"
              variants={textVariants}
            >
              Advanced Project & Task Management
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="progress-bar-container"
            variants={textVariants}
          >
            <motion.div 
              className="progress-bar"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
            />
          </motion.div>
          
          <motion.p 
            className="preloader-text"
            variants={textVariants}
          >
            {loadingText}
          </motion.p>
          
          <motion.div 
            className="loading-dots"
            variants={textVariants}
          >
            {[0, 1, 2].map((i) => (
              <motion.span 
                key={i} 
                className="loading-dot"
                variants={dotVariants}
                animate="visible"
                transition={{ delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;
