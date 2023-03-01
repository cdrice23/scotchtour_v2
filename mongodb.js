import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;
let cached;

if (!process.env.MONGO_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (!cached) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    cached = clientPromise;
    console.log("I am a new connection!");
  } else {
    clientPromise = cached;
    console.log("I am cached!");
  }
}

export default clientPromise;
