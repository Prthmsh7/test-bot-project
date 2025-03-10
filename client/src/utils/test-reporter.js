class CustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  async onRunComplete(contexts, results) {
    const testResults = {
      summary: {
        total: results.numTotalTests,
        passed: results.numPassedTests,
        failed: results.numFailedTests,
        coverage: results.coverageMap?.getCoverageSummary().lines.pct || 0,
      },
      details: results.testResults.map(result => ({
        name: result.testFilePath,
        status: result.numFailingTests === 0 ? 'passed' : 'failed',
        duration: result.perfStats.runtime,
        timestamp: new Date(),
        error: result.failureMessage,
      })),
    };

    // Send results to your API
    try {
      await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResults),
      });
    } catch (error) {
      console.error('Error sending test results:', error);
    }
  }
}

module.exports = CustomReporter; 