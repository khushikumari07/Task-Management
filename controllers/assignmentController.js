const Assignment = require('../models/Assignment');

// @desc    Create assignment
// @route   POST /api/assignments
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, createdBy } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      assignedTo,
      createdBy,
    });

    await assignment.populate(['assignedTo', 'createdBy'], 'name email role');

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @query   page, limit, status, assignedTo, createdBy, sortBy
exports.getAllAssignments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const assignedTo = req.query.assignedTo;
    const createdBy = req.query.createdBy;
    const sortBy = req.query.sortBy || '-createdAt';

    let query = {};

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (createdBy) query.createdBy = createdBy;

    const skip = (page - 1) * limit;

    const assignments = await Assignment.find(query)
      .populate(['assignedTo', 'createdBy'], 'name email role')
      .skip(skip)
      .limit(limit)
      .sort(sortBy);

    const total = await Assignment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: assignments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      ['assignedTo', 'createdBy'],
      'name email role'
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedTo } = req.body;

    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (dueDate) assignment.dueDate = dueDate;
    if (status) assignment.status = status;
    if (assignedTo) assignment.assignedTo = assignedTo;

    await assignment.save();
    await assignment.populate(['assignedTo', 'createdBy'], 'name email role');

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
