import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNotification } from '../components/layout/NotificationSystem';
import LoadingAnimation from '../components/layout/LoadingAnimation';

const SearchTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const { error: showError, success: showSuccess, info: showInfo } = useNotification();
  
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

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      showError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/search?term=${encodeURIComponent(searchTerm)}`);
      
      // Check if the response has the expected structure
      if (res.data && res.data.data && Array.isArray(res.data.data.tasks)) {
        setSearchResults(res.data.data.tasks);
        setSearched(true);
        
        if (res.data.data.tasks.length === 0) {
          if (showInfo) {
            showInfo(`No tasks found matching "${searchTerm}".`);
          }
        } else {
          showSuccess(`Found ${res.data.data.tasks.length} tasks matching "${searchTerm}".`);
        }
      } else {
        // Handle unexpected response structure
        console.error('Unexpected API response structure:', res.data);
        setError('Received an unexpected response from the server');
        showError('Received an unexpected response from the server');
        setSearchResults([]);
        setSearched(true); // Set searched to true to display the empty results message
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error searching tasks';
      setError(errorMessage);
      showError(errorMessage);
      setSearchResults([]);
      setSearched(true); // Set searched to true to display the empty results message
    } finally {
      setLoading(false);
    }
  };
  
  // No longer needed as we're destructuring showInfo from useNotification

  return (
    <motion.div 
      className="container mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="mb-4 display-5 fw-bold"
        variants={itemVariants}
      >
        <i className="fas fa-search me-2 text-primary"></i>
        Search Tasks
      </motion.h1>
      
      <motion.div 
        className="card mb-4 border-0 shadow-sm"
        variants={itemVariants}
      >
        <div className="card-body p-4">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control input-custom"
                placeholder="Search for tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-gradient"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-1"></i> Search
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="text-danger mt-2">{error}</div>
            )}
          </form>
        </div>
      </motion.div>

      {searched && (
        <motion.div 
          className="card border-0 shadow-sm"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="fas fa-list-ul me-2"></i>
              Search Results
            </h5>
          </div>
          <div className="card-body">
            {searchResults.length === 0 ? (
              <div className="alert alert-info">
                No tasks found matching "{searchTerm}".
              </div>
            ) : (
              <>
                <div className="alert alert-success">
                  Found {searchResults.length} tasks matching "{searchTerm}".
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Project</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((task) => (
                        <tr key={task._id}>
                          <td>{task.title}</td>
                          <td>
                            {task.description.length > 50
                              ? `${task.description.substring(0, 50)}...`
                              : task.description}
                          </td>
                          <td>
                            <span className={`badge ${
                              task.status === 'completed'
                                ? 'bg-success'
                                : task.status === 'in-progress'
                                ? 'bg-info'
                                : 'bg-secondary'
                            }`}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td>{task.project.title}</td>
                          <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Link
                              to={`/projects/${task.project._id}`}
                              className="btn btn-sm btn-primary"
                            >
                              View Project
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
      
      {loading && (
        <div className="text-center my-5">
          <LoadingAnimation text="Searching tasks..." />
        </div>
      )}

      <motion.div 
        className="mt-4"
        variants={itemVariants}
      >
        <Link to="/" className="btn btn-secondary rounded-pill">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Dashboard
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default SearchTasks;
