const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// @desc    Create submission
// @route   POST /api/submissions
exports.createSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId, content } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const existingSubmission = await Submission.findOne({ assignmentId, studentId });
    if (existingSubmission) {
      return res.status(400).json({ message: 'Submission already exists for this assignment' });
    }

    const isLate = new Date() > assignment.dueDate;

    const submission = await Submission.create({
      assignmentId,
      studentId,
      content,
      isLate,
    });

    await submission.populate(['assignmentId', 'studentId'], 'name email title');

    // Update assignment status to submitted
    assignment.status = 'submitted';
    await assignment.save();

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions by assignment ID
// @route   GET /api/submissions/:assignmentId
// @query   page, limit
exports.getSubmissionsByAssignmentId = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
      .populate(['assignmentId', 'studentId'], 'name email title')
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments({ assignmentId: req.params.assignmentId });

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:submissionId
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId).populate(
      ['assignmentId', 'studentId'],
      'name email title'
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade submission
// @route   PUT /api/submissions/:id
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    if (grade < 0 || grade > 100) {
      return res.status(400).json({ message: 'Grade must be between 0 and 100' });
    }

    let submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;

    await submission.save();
    await submission.populate(['assignmentId', 'studentId'], 'name email title');

    // Update assignment status to graded
    const assignment = await Assignment.findById(submission.assignmentId);
    assignment.status = 'graded';
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions (for teachers)
// @route   GET /api/submissions
// @query   page, limit, studentId
exports.getAllSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const studentId = req.query.studentId;

    let query = {};
    if (studentId) query.studentId = studentId;

    const skip = (page - 1) * limit;

    const submissions = await Submission.find(query)
      .populate(['assignmentId', 'studentId'], 'name email title')
      .skip(skip)
      .limit(limit)
      .sort('-submissionDate');

    const total = await Submission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
