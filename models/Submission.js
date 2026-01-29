const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  grade: String
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
