import mongoose from "mongoose";

const cleanerSchema = new mongoose.Schema({
  cleaner: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  services: [
    {
      service: {
        required: true,
        type: String,
      },
      type: {
        required: true,
        type: String,
      },
      cost: {
        required: true,
        type: Number,
      },
    },
  ],
  images: [String],
});

export const Cleaner = mongoose.model("Cleaner", cleanerSchema);
