const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  test('POST /api/users/register should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  test('POST /api/users/login shounpm ld reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'notexist',
        password: 'wrong'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});

const { closeDB } = require('../db');

afterAll(async () => {
  await closeDB();
});
