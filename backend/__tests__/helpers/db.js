import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Spins up a throwaway in-memory MongoDB so integration tests never touch the
// real Atlas database. Used by the integration test suites.
let mongod;

export async function connectTestDB() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

export async function clearTestDB() {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

export async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
}
