const request = require('supertest');
const express = require('express');

jest.mock('../controllers/channelController', () => ({
  createChannel: jest.fn((req, res) =>
    res.status(201).json({ message: `Channel ${req.body.name} created` })
  ),
  addUserToChannel: jest.fn((req, res) =>
    res.status(200).json({ message: `User ${req.body.userId} added to channel ${req.params.channelId}` })
  ),
  removeUserFromChannel: jest.fn((req, res) =>
    res.status(200).json({ message: `User ${req.body.userId} removed from channel ${req.params.channelId}` })
  ),
  leaveChannel: jest.fn((req, res) =>
    res.status(200).json({ message: `User ${req.body.userId} left channel ${req.body.channelId}` })
  ),
  getGroupChannelsForUser: jest.fn((req, res) =>
    res.status(200).json([
      { id: 'ch1', name: 'General', groupId: req.params.groupId },
      { id: 'ch2', name: 'Random', groupId: req.params.groupId }
    ])
  ),
  deleteChannel: jest.fn((req, res) =>
    res.status(200).json({ message: `Channel ${req.params.channelId} deleted` })
  )
}));

const channelRoutes = require('../routes/channelRoutes');

const app = express();
app.use(express.json());
app.use('/channels', channelRoutes);

describe('Channel Routes', () => {
  test('POST /channels/create should create a new channel', async () => {
    const res = await request(app)
      .post('/channels/create')
      .send({ name: 'general', groupId: 'g1', adminId: 'a1' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain('created');
  });

  test('POST /channels/:channelId/add-user should add a user to a channel', async () => {
    const res = await request(app)
      .post('/channels/ch1/add-user')
      .send({ userId: 'u1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('added');
  });

  test('POST /channels/:channelId/remove-user should remove a user from a channel', async () => {
    const res = await request(app)
      .post('/channels/ch1/remove-user')
      .send({ userId: 'u1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('removed');
  });

  test('POST /channels/leave should let a user leave a channel', async () => {
    const res = await request(app)
      .post('/channels/leave')
      .send({ userId: 'u1', channelId: 'ch1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('left');
  });

  test('GET /channels/group/:groupId should return channels for a group', async () => {
    const res = await request(app).get('/channels/group/g1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('groupId', 'g1');
  });

  test('DELETE /channels/:channelId should delete a channel', async () => {
    const res = await request(app).delete('/channels/ch1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
