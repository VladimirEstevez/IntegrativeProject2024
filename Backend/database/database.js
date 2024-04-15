const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URL
const url = process.env.DATABASE_URL;

// Create a new mongoClient instance. We will use this instance to connect to a MongoDB server.
const client = new MongoClient(url);

// This function stablishes a connection to the MongoDB database.
async function connect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to MongoDB database");

  return "done.";
}

// We export the connect method and the collection reference
module.exports = {
  connect,
  client,
};
