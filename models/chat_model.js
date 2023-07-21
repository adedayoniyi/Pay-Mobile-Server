const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    sender: {
      type: String,
      trim: true,
      ref: "User",
    },
    receiver: {
      type: String,
      trim: true,
      ref: "User",
    },
    latestMessage: {
      type: String,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
