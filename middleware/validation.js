const joi = require('joi');

const validateUserRegistration = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required(),
    password: joi.string().required().min(6),
    role: joi.string().valid('student', 'teacher', 'admin'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateAssignment = (req, res, next) => {
  const schema = joi.object({
    title: joi.string().required().min(3),
    description: joi.string().required().min(10),
    dueDate: joi.date().required(),
    assignedTo: joi.string().required(),
    createdBy: joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateSubmission = (req, res, next) => {
  const schema = joi.object({
    assignmentId: joi.string().required(),
    studentId: joi.string().required(),
    content: joi.string().required().min(10),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateGrading = (req, res, next) => {
  const schema = joi.object({
    grade: joi.number().min(0).max(100).required(),
    feedback: joi.string().required().min(5),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateAssignment,
  validateSubmission,
  validateGrading,
};
