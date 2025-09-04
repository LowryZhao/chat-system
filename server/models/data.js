const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

let db = {
  users: [],
  groups: [],
  channels: []
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(raw);
      console.log('Data loaded from data.json');
    } else {
      console.log('No data.json found, starting with default data...');
      db = {
        users: [
          {
            id: '1',
            username: 'super',
            password: '123',
            email: 'super@admin.com',
            roles: ['super_admin'],
            groups: []
          },
          {
            id: '2',
            username: 'user1',
            password: '123',
            email: 'user1@example.com',
            roles: ['user'],
            groups: []
          },
          {
            id: '3',
            username: 'user2',
            password: '123',
            email: 'user2@example.com',
            roles: ['user'],
            groups: []
          }
        ],
        groups: [
          {
            id: '1',
            name: 'Group 1',
            admins: ['1'],
            members: ['1', '2'],
            channels: ['1', '2']
          },
          {
            id: '2',
            name: 'Group 2',
            admins: ['1'],
            members: ['1', '3'],
            channels: ['3']
          }
        ],
        channels: [
          { id: '1', name: 'General', groupId: '1', members: ['1', '2'] },
          { id: '2', name: 'Random', groupId: '1', members: ['1'] },
          { id: '3', name: 'Announcements', groupId: '2', members: ['1', '3'] }
        ]
      };
      saveData();
    }
  } catch (err) {
    console.error('Error loading data.json:', err);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
    console.log('Data saved to data.json');
  } catch (err) {
    console.error('Error saving data.json:', err);
  }
}

module.exports = {
  get users() {
    return db.users;
  },
  get groups() {
    return db.groups;
  },
  get channels() {
    return db.channels;
  },
  set users(val) {
    db.users = val;
    saveData();
  },
  set groups(val) {
    db.groups = val;
    saveData();
  },
  set channels(val) {
    db.channels = val;
    saveData();
  },
  saveData,
  loadData
};

loadData();
