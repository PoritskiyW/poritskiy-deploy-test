import { connect } from "./../controllers/MongoDB.controller";

export function databaseErorHandler() {
  console.error.bind(console, "MongoDB connection error:");
  connect();
}
