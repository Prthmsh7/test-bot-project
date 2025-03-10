const mongoose = require('mongoose');
const TestResult = require('../models/TestResult');

async function generateSampleData() {
  await mongoose.connect('mongodb://localhost:27017/bugzilla');

  // Generate 30 days of test data
  const days = 30;
  const baseDate = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const testResult = new TestResult({
      summary: {
        total: Math.floor(Math.random() * 50) + 100,
        passed: Math.floor(Math.random() * 40) + 80,
        failed: Math.floor(Math.random() * 10),
        coverage: Math.floor(Math.random() * 20) + 80,
      },
      details: Array.from({ length: 5 }, (_, index) => ({
        name: `
</rewritten_file> 