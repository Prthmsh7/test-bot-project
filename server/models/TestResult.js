const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  summary: {
    total: Number,
    passed: Number,
    failed: Number,
    coverage: Number,
  },
  details: [{
    name: String,
    status: String,
    duration: Number,
    timestamp: Date,
    error: String,
  }],
  timestamp: Date,
});

module.exports = mongoose.model('TestResult', TestResultSchema); 