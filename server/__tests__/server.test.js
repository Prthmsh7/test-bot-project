const request = require('supertest');
const app = require('../app');

describe('Server API', () => {
  test('GET / returns server status', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Server is running');
  });

  test('Socket.IO connection handling', (done) => {
    // Add socket.io tests
    done();
  });
}); 