const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'chatApp';
let client;

async function connectDB() {
  if (!client || !client.topology?.isConnected()) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client.db(dbName);
}

module.exports = { connectDB };
