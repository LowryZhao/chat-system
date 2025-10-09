const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

jest.mock('../db', () => ({
  connectDB: jest.fn(async () => ({
    collection: jest.fn(() => ({
      updateOne: jest.fn(async (query) => {
        if (query.id === '404') {
          return { matchedCount: 0 };
        }
        return { matchedCount: 1 };
      })
    }))
  }))
}));

const uploadRoutes = require('../routes/uploadRoutes');

const app = express();
app.use(express.json());
app.use('/upload', uploadRoutes);

describe('Upload Routes', () => {
  const dummyFilePath = path.join(__dirname, 'dummy.png');

  beforeAll(() => {
    fs.writeFileSync(dummyFilePath, 'fakeimagecontent');
  });

  afterAll(() => {
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
  });

  test('POST /upload/image should upload a chat image successfully', async () => {
    const res = await request(app)
      .post('/upload/image')
      .attach('image', dummyFilePath);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('path');
    expect(res.body.path).toMatch(/\/uploads\/chat\//);
  });

  test('POST /upload/avatar should upload avatar and update DB', async () => {
    const res = await request(app)
      .post('/upload/avatar')
      .field('userId', '1')
      .attach('avatar', dummyFilePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Avatar uploaded');
    expect(res.body.path).toMatch(/\/uploads\/avatars\//);
  });

  test('POST /upload/avatar should return 404 if user not found', async () => {
    const res = await request(app)
      .post('/upload/avatar')
      .field('userId', '404')
      .attach('avatar', dummyFilePath);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  test('POST /upload/image should fail without file', async () => {
    const res = await request(app).post('/upload/image');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('No file uploaded');
  });
});
