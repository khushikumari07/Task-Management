const express = require('express');
const {
  createSubmission,
  getSubmissionsByAssignmentId,
  getSubmissionById,
  gradeSubmission,
  deleteSubmission,
  getAllSubmissions,
} = require('../controllers/submissionController');
const { validateSubmission, validateGrading } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All submission routes require authentication
router.use(protect);

router.post('/', validateSubmission, authorize('student'), createSubmission);
router.get('/', getAllSubmissions);
router.get('/assignment/:assignmentId', getSubmissionsByAssignmentId);
router.get('/:submissionId', getSubmissionById);
router.put('/:id', authorize('teacher', 'admin'), validateGrading, gradeSubmission);
router.delete('/:id', authorize('teacher', 'admin', 'student'), deleteSubmission);

module.exports = router;
