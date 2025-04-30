import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/stats');
        setStats(res.data.data.stats);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="text-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your statistics...</p>
          </motion.div>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  }

  if (!stats) {
    return null;
  }

  // Calculate completion percentage
  const completionPercentage = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;
    
  // Calculate remaining percentage
  const todoPercentage = stats.totalTasks > 0
    ? Math.round((stats.todoTasks / stats.totalTasks) * 100)
    : 0;
    
  const inProgressPercentage = stats.totalTasks > 0
    ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-4"
    >
      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Header className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-chart-line me-2"></i>
            Dashboard Statistics
          </h5>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <i className="fas fa-sync-alt" style={{ cursor: 'pointer' }}></i>
          </motion.div>
        </Card.Header>
        <Card.Body className="p-4">
          <Row>
            <Col md={3} className="mb-3 mb-md-0">
              <motion.div variants={itemVariants}>
                <Card className={`h-100 border-0 ${darkMode ? 'bg-dark' : 'bg-light'} shadow-sm`}>
                  <Card.Body className="text-center p-4">
                    <div className="icon-wrapper mb-3">
                      <i className="fas fa-folder text-primary" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <motion.h1 
                      className="display-4 fw-bold text-primary mb-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                    >
                      {stats.totalProjects}
                    </motion.h1>
                    <p className="text-muted mb-0 mt-2">Projects</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <motion.div variants={itemVariants}>
                <Card className={`h-100 border-0 ${darkMode ? 'bg-dark' : 'bg-light'} shadow-sm`}>
                  <Card.Body className="text-center p-4">
                    <div className="icon-wrapper mb-3">
                      <i className="fas fa-tasks text-info" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <motion.h1 
                      className="display-4 fw-bold text-info mb-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                    >
                      {stats.totalTasks}
                    </motion.h1>
                    <p className="text-muted mb-0 mt-2">Total Tasks</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <motion.div variants={itemVariants}>
                <Card className={`h-100 border-0 ${darkMode ? 'bg-dark' : 'bg-light'} shadow-sm`}>
                  <Card.Body className="text-center p-4">
                    <div className="icon-wrapper mb-3">
                      <i className="fas fa-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <motion.h1 
                      className="display-4 fw-bold text-success mb-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5, type: 'spring' }}
                    >
                      {stats.completedTasks}
                    </motion.h1>
                    <p className="text-muted mb-0 mt-2">Completed</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div variants={itemVariants}>
                <Card className={`h-100 border-0 ${darkMode ? 'bg-dark' : 'bg-light'} shadow-sm`}>
                  <Card.Body className="text-center p-4">
                    <div className="icon-wrapper mb-3">
                      <i className="fas fa-spinner text-warning" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <motion.h1 
                      className="display-4 fw-bold text-warning mb-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                    >
                      {stats.inProgressTasks}
                    </motion.h1>
                    <p className="text-muted mb-0 mt-2">In Progress</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          <motion.div 
            className="mt-4 p-3 bg-light rounded-3"
            variants={itemVariants}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Task Completion</h6>
              <span className="badge bg-success rounded-pill">{completionPercentage}%</span>
            </div>
            <ProgressBar className="mb-3" style={{ height: '10px' }}>
              <ProgressBar variant="success" now={completionPercentage} key={1} />
              <ProgressBar variant="warning" now={inProgressPercentage} key={2} />
              <ProgressBar variant="secondary" now={todoPercentage} key={3} />
            </ProgressBar>
            <div className="d-flex justify-content-between text-muted small">
              <div>
                <i className="fas fa-check-circle text-success me-1"></i> Completed
              </div>
              <div>
                <i className="fas fa-spinner text-warning me-1"></i> In Progress
              </div>
              <div>
                <i className="fas fa-clock text-secondary me-1"></i> To Do
              </div>
            </div>
          </motion.div>
          
          {stats.totalTasks > 0 && (
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="productivity-score p-3 rounded-circle d-inline-flex align-items-center justify-content-center" 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  background: `conic-gradient(#28a745 ${completionPercentage * 3.6}deg, #f0f0f0 0deg)`,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <div className="inner-circle rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    background: darkMode ? '#2c2c2c' : 'white'
                  }}
                >
                  <div>
                    <h3 className="mb-0 fw-bold">{completionPercentage}%</h3>
                    <small className="text-muted">Productivity</small>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default DashboardStats;
