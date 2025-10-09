const request = require('supertest');
const express = require('express');

jest.mock('../controllers/userController', () => ({
  register: jest.fn((req, res) => {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    return res.status(200).json({ username });
  }),

  login: jest.fn((req, res) => {
    const { username, password } = req.body;
    if (username === 'super' && password === '123') {
      return res.status(200).json({ username });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }),

  createUserByAdmin: jest.fn((req, res) =>
    res.status(200).json({ message: 'User created by admin' })
  ),

  removeUser: jest.fn((req, res) =>
    res.status(200).json({ message: 'User removed successfully' })
  ),

  updateAvatar: jest.fn((req, res) =>
    res.status(200).json({ path: '/uploads/avatar.png' })
  )
}));

const userRoutes = require('../routes/userRoutes');
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('🧪 User Routes', () => {
  test('POST /users/register should create a new user', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  test('POST /users/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        username: 'notexist',
        password: 'wrong'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  test('POST /users/login should accept valid credentials', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        username: 'super',
        password: '123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('super');
  });
});

afterAll(async () => {
  if (jest.isMockFunction(require('../db')?.closeDB)) {
    await require('../db').closeDB();
  }
});
