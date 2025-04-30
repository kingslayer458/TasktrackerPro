const express = require('express');
const taskController = require('../controllers/taskController');
const searchController = require('../controllers/searchController');
const exportController = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Task routes
router.post('/', taskController.createTask);
router.get('/project/:projectId', taskController.getAllTasks);
router.get('/search', searchController.searchTasks);
router.get('/export/csv', exportController.exportTasksCSV);

router.route('/:id')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
