const fs = require('fs');
const { MongoClient } = require('mongodb')

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'chatapp';
const filePath = './models/data.json';

(async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    if (!jsonData.users || !jsonData.groups || !jsonData.channels) {
      throw new Error('error');
    }

    await db.collection('users').deleteMany({});
    await db.collection('groups').deleteMany({});
    await db.collection('channels').deleteMany({});

    await db.collection('users').insertMany(jsonData.users);
    await db.collection('groups').insertMany(jsonData.groups);
    await db.collection('channels').insertMany(jsonData.channels);

    console.log('All data imported successfully!');
    await client.close();
  } catch (err) {
    console.error('Import failed:', err);
  }
})();
