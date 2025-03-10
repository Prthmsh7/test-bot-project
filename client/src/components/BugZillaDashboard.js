import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Container,
  Typography,
  LinearProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  BugReport,
  CheckCircle,
  Error,
  Timeline,
  Speed,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BugZillaDashboard = () => {
  const [testResults, setTestResults] = useState({
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      coverage: 0,
    },
    history: [],
    recentTests: [],
  });

  useEffect(() => {
    // Fetch test results from your API
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const response = await fetch('/api/test-results');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          🐛 BugZilla Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, bgcolor: 'primary.light' }}>
              <Typography variant="h6">Total Tests</Typography>
              <Typography variant="h3">{testResults.summary.total}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, bgcolor: 'success.light' }}>
              <Typography variant="h6">Passed</Typography>
              <Typography variant="h3">{testResults.summary.passed}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, bgcolor: 'error.light' }}>
              <Typography variant="h6">Failed</Typography>
              <Typography variant="h3">{testResults.summary.failed}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, bgcolor: 'info.light' }}>
              <Typography variant="h6">Coverage</Typography>
              <Typography variant="h3">{testResults.summary.coverage}%</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Test History Chart */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Test History
          </Typography>
          <LineChart width={800} height={300} data={testResults.history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="passed" stroke="#4caf50" />
            <Line type="monotone" dataKey="failed" stroke="#f44336" />
          </LineChart>
        </Paper>

        {/* Recent Test Results */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Test Results
          </Typography>
          <List>
            {testResults.recentTests.map((test, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {test.status === 'passed' ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Error color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={test.name}
                  secondary={`Duration: ${test.duration}ms | ${test.timestamp}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default BugZillaDashboard; 