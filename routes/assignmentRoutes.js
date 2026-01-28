const express = require('express');
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');
const { validateAssignment } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All assignment routes require authentication
router.use(protect);

router.post('/', validateAssignment, authorize('teacher', 'admin'), createAssignment);
router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.put('/:id', authorize('teacher', 'admin'), updateAssignment);
router.delete('/:id', authorize('teacher', 'admin'), deleteAssignment);

module.exports = router;
