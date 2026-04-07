const express = require('express');
const { submitProject, getMyProjects, getAllProjects, getProjectById, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, submitProject);
router.get('/my', protect, getMyProjects);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.delete('/:id', protect, deleteProject);

module.exports = router;
