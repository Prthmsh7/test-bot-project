const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');

// Store test results
router.post('/test-results', async (req, res) => {
  try {
    const testResult = new TestResult({
      summary: req.body.summary,
      details: req.body.details,
      timestamp: new Date(),
    });
    await testResult.save();
    res.status(201).json(testResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test results
router.get('/test-results', async (req, res) => {
  try {
    const results = await TestResult.find()
      .sort({ timestamp: -1 })
      .limit(100);
    
    const summary = {
      total: results[0]?.summary.total || 0,
      passed: results[0]?.summary.passed || 0,
      failed: results[0]?.summary.failed || 0,
      coverage: results[0]?.summary.coverage || 0,
    };

    const history = results.map(r => ({
      date: r.timestamp,
      passed: r.summary.passed,
      failed: r.summary.failed,
    }));

    const recentTests = results[0]?.details || [];

    res.json({ summary, history, recentTests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 