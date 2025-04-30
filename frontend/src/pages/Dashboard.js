import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import DashboardStats from '../components/dashboard/DashboardStats';
import { useNotification } from '../components/layout/NotificationSystem';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const { success, error: showError } = useNotification();

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
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data.data.projects);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching projects');
        showError(err.response?.data?.message || 'Error fetching projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showError]);
  
  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description
    });
    setFormErrors({});
    setShowEditModal(true);
  };
  
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProject(null);
  };
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await axios.patch(`http://localhost:5000/api/projects/${editingProject._id}`, formData);
      
      // Update the project in the projects array
      setProjects(projects.map(project => 
        project._id === editingProject._id ? res.data.data.project : project
      ));
      
      success('Project updated successfully');
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating project';
      setFormErrors({ general: errorMessage });
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5">Loading your projects...</p>
          </motion.div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardStats />
      </motion.div>
      
      <motion.div 
        className="d-flex justify-content-between align-items-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h1 className="display-5 fw-bold">
          <i className="fas fa-project-diagram me-2 text-primary"></i>
          My Projects
        </h1>
        <div>
          <Link to="/profile" className="btn btn-outline-secondary me-2 rounded-pill">
            <i className="fas fa-user"></i> My Profile
          </Link>
          {projects.length < 4 && (
            <Link to="/projects/new" className="btn btn-primary rounded-pill">
              <i className="fas fa-plus"></i> New Project
            </Link>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-danger" 
          role="alert"
        >
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </motion.div>
      )}

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center p-5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <i className="fas fa-folder-plus text-primary mb-3" style={{ fontSize: '4rem' }}></i>
                <h3 className="card-title mb-3">No Projects Found</h3>
                <p className="card-text fs-5 text-muted mb-4">
                  You haven't created any projects yet. Get started by creating your first project!
                </p>
                <Link to="/projects/new" className="btn btn-primary btn-lg rounded-pill px-4">
                  <i className="fas fa-plus me-2"></i> Create First Project
                </Link>
              </motion.div>
            </Card.Body>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row>
            {projects.map((project, index) => (
              <Col md={6} lg={4} className="mb-4" key={project._id}>
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-3">
                        <h5 className="card-title fw-bold">{project.title}</h5>
                        {project.tasks && project.tasks.length > 0 && (
                          <Badge bg="primary" pill>
                            {project.tasks.length} Tasks
                          </Badge>
                        )}
                      </div>
                      <Card.Text className="text-muted">
                        {project.description.length > 100
                          ? `${project.description.substring(0, 100)}...`
                          : project.description}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          <i className="far fa-calendar-alt me-1"></i>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </small>
                        <div>
                          {project.tasks && (
                            <>
                              {project.tasks.filter(t => t.status === 'completed').length > 0 && (
                                <Badge bg="success" className="me-1" pill>
                                  {project.tasks.filter(t => t.status === 'completed').length} Done
                                </Badge>
                              )}
                              {project.tasks.filter(t => t.status === 'in-progress').length > 0 && (
                                <Badge bg="warning" pill>
                                  {project.tasks.filter(t => t.status === 'in-progress').length} In Progress
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-transparent border-top-0 p-3">
                      <div className="d-flex gap-2">
                        <Link
                          to={`/projects/${project._id}`}
                          className="btn btn-outline-primary flex-grow-1 rounded-pill"
                        >
                          <i className="fas fa-eye me-2"></i> View Details
                        </Link>
                        <Button 
                          variant="outline-info" 
                          className="rounded-circle" 
                          onClick={() => handleEditClick(project)}
                          title="Edit project"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      )}

      {projects.length >= 4 && (
        <motion.div 
          className="alert alert-info mt-4" 
          role="alert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <i className="fas fa-info-circle me-2"></i>
          You have reached the maximum limit of 4 projects.
        </motion.div>
      )}
      
      {/* Quick Actions Floating Button */}
      <motion.div 
        className="position-fixed bottom-0 end-0 p-3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3, type: 'spring' }}
        style={{ zIndex: 1030 }}
      >
        <div className="dropdown">
          <Button 
            className="btn-lg rounded-circle shadow" 
            style={{ width: '60px', height: '60px' }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-plus"></i>
          </Button>
          <ul className="dropdown-menu dropdown-menu-end">
            {projects.length < 4 && (
              <li>
                <Link className="dropdown-item" to="/projects/new">
                  <i className="fas fa-folder-plus me-2 text-primary"></i> New Project
                </Link>
              </li>
            )}
            <li>
              <Link className="dropdown-item" to="/search">
                <i className="fas fa-search me-2 text-info"></i> Search Tasks
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/profile">
                <i className="fas fa-user-cog me-2 text-success"></i> My Profile
              </Link>
            </li>
          </ul>
        </div>
      </motion.div>
      
      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-edit me-2"></i>
            Edit Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formErrors.general && (
            <div className="alert alert-danger">{formErrors.general}</div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!formErrors.title}
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.title}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                isInvalid={!!formErrors.description}
                className="input-custom"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button className="btn-gradient" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  'Update Project'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;
