// Utility to set up an in-memory MongoDB server for tests

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Before all tests run, start in-memory MongoDB server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      port: 27017, // Optional: Specify a port
    },
    binary: {
      downloadDir: './.mongodb-binaries', // Optional: Specify a custom download directory
      timeout: 30000, // Increase the timeout to 30 seconds
    },
  });
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// After each test, clean all collections (ensures isolation)
// afterEach(async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     await collections[key].deleteMany();
//   }
// });

// After all tests complete, disconnect and stop in-memory server
afterAll(async () => {
  // Added for product service tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }

  await mongoose.disconnect();
  await mongoServer.stop();
});
