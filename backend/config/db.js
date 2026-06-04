import mongoose from "mongoose";

let mongodInstance = null;

const connectDb = async () => {
  // 1. Try the configured MONGO_URI first
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Database connected successfully to Atlas.");
      return;
    } catch (err) {
      console.warn(
        `Atlas connection failed (${err.message}). Falling back to in-memory MongoDB.`
      );
    }
  }

  // 2. Fallback: spin up an embedded in-memory MongoDB instance
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri);
    console.log("Database connected successfully (in-memory MongoDB).");
  } catch (fallbackErr) {
    console.error("In-memory MongoDB fallback also failed:", fallbackErr.message);
    throw fallbackErr;
  }
};

export default connectDb;