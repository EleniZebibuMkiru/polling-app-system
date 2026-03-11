const request = require('supertest');
const app = require('../server');

describe('Authentication endpoints', () => {
  // use a random user email to avoid conflicts
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'password123';
  let token;

  it('should reject registering with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/all fields required/i);
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: testEmail,
        password: testPassword,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered successfully/i);
  });

  it('should not register duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: testEmail,
        password: testPassword,
      });
    expect(res.statusCode).toBe(500);
    // could be unique constraint; we just ensure it's not 201
    expect(res.body.message).not.toMatch(/registered successfully/i);
  });

  it('should login the newly created user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  afterAll(async () => {
    // cleanup: delete the test user directly using db connection
    const db = require('../config/db');
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM users WHERE email = ?', [testEmail], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    db.end();
  });
});