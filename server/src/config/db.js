import mongoose from "mongoose";
import { env } from "./env.js";

const globalMongoose = globalThis.__chawlaMongoose || {
  connection: null,
  connectionPromise: null,
};

globalThis.__chawlaMongoose = globalMongoose;

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  if (globalMongoose.connection && mongoose.connection.readyState === 1) {
    return globalMongoose.connection;
  }

  if (!globalMongoose.connectionPromise) {
    globalMongoose.connectionPromise = mongoose
      .connect(env.mongodbUri)
      .then((connection) => {
        globalMongoose.connection = connection;
        return connection;
      })
      .catch((error) => {
        globalMongoose.connectionPromise = null;
        throw error;
      });
  }

  return globalMongoose.connectionPromise;
}
