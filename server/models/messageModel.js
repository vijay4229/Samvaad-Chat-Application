import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      // --- THIS IS THE CHANGE ---
      // 'Mixed' allows the field to store any type of data (String or Object)
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;