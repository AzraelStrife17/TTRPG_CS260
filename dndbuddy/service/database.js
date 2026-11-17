const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('dndbuddy');
const userCollection = db.collection('users');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database: ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
 return userCollection.findOne({ email });
}

function getUserByToken(token) {
 return userCollection.findOne({ token });
}

async function addUser(user) {
 await userCollection.insertOne(user);
}

async function updateUser(user) {
 const userData = { ...user };
 delete userData._id;

 await userCollection.updateOne(
   { email: user.email },
   { $set: userData }
 );
}

async function updateUserRemoveAuth(user) {
 await userCollection.updateOne(
   { email: user.email },
   { $unset: { token: 1 } }
 );
}

module.exports = {
 collection: db.collection.bind(db),
 getUser,
 getUserByToken,
 addUser,
 updateUser,
 updateUserRemoveAuth,
};