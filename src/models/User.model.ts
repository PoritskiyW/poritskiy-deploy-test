import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  cash: Number,
  firstName: {
    type: String,
    default: "Не указано",
  },
  middleName: {
    type: String,
    default: "Не указано",
  },
  lastName: {
    type: String,
    default: "Не указано",
  },
});

export const User = mongoose.model("User", userSchema);
