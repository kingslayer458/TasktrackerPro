import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeContext from '../../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <motion.footer 
      className={`${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'} py-4 mt-5`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <i className="fas fa-tasks me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
              <h5 className="mb-0">Task Tracker</h5>
            </div>
            <p className="text-muted small mt-2 mb-0">
              Organize your projects and tasks efficiently
            </p>
          </Col>
          
          <Col md={4} className="text-center mb-3 mb-md-0">
            <h6 className="mb-2">Quick Links</h6>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="text-decoration-none text-muted small">Dashboard</Link>
              <Link to="/search" className="text-decoration-none text-muted small">Search</Link>
              <Link to="/profile" className="text-decoration-none text-muted small">Profile</Link>
            </div>
          </Col>
          
          <Col md={4} className="text-center text-md-end">
      
            <div className="mt-2">
              <a href="https://github.com/kingslayer458" className="text-decoration-none me-2" aria-label="GitHub">
                <i className="fab fa-github text-muted"></i>
              </a>

              <a href="https://www.linkedin.com/in/manoj-kumar-3b9855206/" className="text-decoration-none" aria-label="LinkedIn">
                <i className="fab fa-linkedin text-muted"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.footer>
  );
};

export default Footer;
