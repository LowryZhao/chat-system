const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/chatapp';
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client.db('chatapp');
}

async function closeDB() {
  await client.close();
}

module.exports = { connectDB, closeDB };
