'use strict';

const request = require('supertest');
const app = require('../../src/app');

describe('Health endpoint', () => {
  it('GET /health → 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('user-management-service');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health returns JSON content-type', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

describe('404 handler', () => {
  it('unknown route → 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
