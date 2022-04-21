import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cleaner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  ordered: [
    {
      service: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
    },
  ],
  cleanerName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  returnCase: String,
});

export const Order = mongoose.model("Order", orderSchema);
