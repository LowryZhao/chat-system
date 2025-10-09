const request = require('supertest');
const express = require('express');

jest.mock('../controllers/groupController', () => ({
  getUserGroups: jest.fn((req, res) =>
    res.status(200).json([{ id: 'g1', name: 'Test Group' }])
  ),
  getAllGroups: jest.fn((req, res) =>
    res.status(200).json([{ id: 'g1', name: 'Group A' }, { id: 'g2', name: 'Group B' }])
  ),
  createGroup: jest.fn((req, res) =>
    res.status(201).json({ message: `Group ${req.body.name} created` })
  ),
  addUserToGroup: jest.fn((req, res) =>
    res.status(200).json({ message: `User ${req.body.userId} added to group ${req.params.groupId}` })
  ),
  removeUserFromGroup: jest.fn((req, res) =>
    res.status(200).json({ message: `User ${req.body.userId} removed from group ${req.params.groupId}` })
  ),
  deleteGroup: jest.fn((req, res) =>
    res.status(200).json({ message: `Group ${req.params.groupId} deleted` })
  )
}));

const groupRoutes = require('../routes/groupRoutes');

const app = express();
app.use(express.json());
app.use('/groups', groupRoutes);

describe('Group Routes', () => {
  test('GET /groups/user/:userId should return groups for a user', async () => {
    const res = await request(app).get('/groups/user/1');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('name', 'Test Group');
  });

  test('GET /groups/all should return all groups', async () => {
    const res = await request(app).get('/groups/all');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('POST /groups/create should create a new group', async () => {
    const res = await request(app)
      .post('/groups/create')
      .send({ name: 'My New Group', adminId: 'a1' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain('created');
  });

  test('POST /groups/:groupId/add-user should add user to group', async () => {
    const res = await request(app)
      .post('/groups/g1/add-user')
      .send({ userId: 'u1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('added');
  });

  test('POST /groups/:groupId/remove-user should remove user from group', async () => {
    const res = await request(app)
      .post('/groups/g1/remove-user')
      .send({ userId: 'u1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('removed');
  });

  test('DELETE /groups/:groupId should delete group', async () => {
    const res = await request(app).delete('/groups/g1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
