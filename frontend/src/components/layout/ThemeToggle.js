import { useContext } from 'react';
import { motion } from 'framer-motion';
import ThemeContext from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  // Animation variants
  const toggleVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    animate: { rotate: darkMode ? 180 : 0 }
  };

  const springTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 15
  };

  return (
    <motion.div
      className={`theme-toggle rounded-pill px-3 py-2 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
      onClick={toggleTheme}
      variants={toggleVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={springTransition}
      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center">
        <motion.div
          variants={iconVariants}
          initial="initial"
          animate="animate"
          transition={springTransition}
          className="me-2"
        >
          {darkMode ? (
            <i className="fas fa-sun text-warning"></i>
          ) : (
            <i className="fas fa-moon text-primary"></i>
          )}
        </motion.div>
        <motion.span 
          className="d-none d-md-inline small"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default ThemeToggle;
