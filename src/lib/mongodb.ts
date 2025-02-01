import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDb() {
  await client.connect();
  return client.db(process.env.MONGODB_DB);
}