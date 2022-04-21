import mongoose from "mongoose";

import { mongoDBConfig } from "../configs/mongoDB.config";

export async function connect() {
  try {
    await mongoose.connect(mongoDBConfig.url);
    console.log("database connected succesfully");
    return mongoose.connection;
  } catch (err) {
    console.log("error during connection to database");
    console.error(err);
    connect();
  }
}
