import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar as BootstrapNavbar, Nav, Container, Dropdown } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    logout();
  };
  
  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: 'easeOut' 
      }
    }
  };
  
  const linkVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const authLinks = (
    <>
      <Nav.Item>
        <motion.div whileHover="hover" variants={linkVariants}>
          <Nav.Link 
            as={Link} 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            <i className="fas fa-home me-1"></i> Dashboard
          </Nav.Link>
        </motion.div>
      </Nav.Item>
      
      <Nav.Item>
        <motion.div whileHover="hover" variants={linkVariants}>
          <Nav.Link 
            as={Link} 
            to="/projects/new"
            className={location.pathname === '/projects/new' ? 'active' : ''}
          >
            <i className="fas fa-plus me-1"></i> New Project
          </Nav.Link>
        </motion.div>
      </Nav.Item>
      
      <Nav.Item>
        <motion.div whileHover="hover" variants={linkVariants}>
          <Nav.Link 
            as={Link} 
            to="/search"
            className={location.pathname === '/search' ? 'active' : ''}
          >
            <i className="fas fa-search me-1"></i> Search Tasks
          </Nav.Link>
        </motion.div>
      </Nav.Item>
      
      <Nav.Item>
        <Dropdown>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Dropdown.Toggle 
              as={Nav.Link}
              id="user-dropdown"
              className="d-flex align-items-center"
            >
              <i className="fas fa-user-circle me-1"></i> 
              {user ? user.name : 'Account'}
            </Dropdown.Toggle>
          </motion.div>
          
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/profile">
              <i className="fas fa-id-card me-1"></i> My Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>
              <i className="fas fa-sign-out-alt me-1"></i> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav.Item>
    </>
  );

  const guestLinks = (
    <>
      <Nav.Item>
        <motion.div whileHover="hover" variants={linkVariants}>
          <Nav.Link 
            as={Link} 
            to="/register"
            className={location.pathname === '/register' ? 'active' : ''}
          >
            <i className="fas fa-user-plus me-1"></i> Register
          </Nav.Link>
        </motion.div>
      </Nav.Item>
      
      <Nav.Item>
        <motion.div whileHover="hover" variants={linkVariants}>
          <Nav.Link 
            as={Link} 
            to="/login"
            className={location.pathname === '/login' ? 'active' : ''}
          >
            <i className="fas fa-sign-in-alt me-1"></i> Login
          </Nav.Link>
        </motion.div>
      </Nav.Item>
    </>
  );

  return (
    <motion.div
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <BootstrapNavbar 
        expand="lg" 
        variant={darkMode ? 'dark' : 'light'}
        bg={darkMode ? 'dark' : 'light'}
        className={`${scrolled ? 'shadow-sm' : ''} py-2 fixed-top`}
        style={{
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? `1px solid ${darkMode ? '#2c2c2c' : '#e9e9e9'}` : 'none',
        }}
      >
        <Container>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <BootstrapNavbar.Brand as={Link} to="/">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="d-inline-block me-2"
              >
                <i className="fas fa-tasks text-primary"></i>
              </motion.div>
              <span className="fw-bold">Task Tracker</span>
              <span className="badge bg-primary ms-2 rounded-pill">Pro</span>
            </BootstrapNavbar.Brand>
          </motion.div>
          
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {isAuthenticated ? authLinks : guestLinks}
              <Nav.Item className="ms-2 d-flex align-items-center">
                <ThemeToggle />
              </Nav.Item>
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      
      {/* Add spacing to account for fixed navbar */}
      <div style={{ paddingTop: '76px' }}></div>
    </motion.div>
  );
};

export default Navbar;
