const express = require("express");
const Chat = require("../models/chat_model");
const User = require("../models/user_model");
const chatRouter = express.Router();

chatRouter.post("/chat", async (req, res) => {
  const { sender, receiver, chatName } = req.body;
  try {
    const chat = await Chat.findOne({
      $or: [
        { $and: [{ sender: sender }, { receiver: receiver }] },
        { $and: [{ sender: receiver }, { receiver: sender }] },
      ],
    });
    const user = await User.find({
      $or: [{ username: sender }, { username: receiver }],
    });
    if (user.length !== 2) {
      return res.status(400).json({ message: "Users not found" });
    }
    if (!chat) {
      const newChat = new Chat({ sender, receiver, chatName });
      await newChat.save();
      res.status(201).json(newChat);
    } else {
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = chatRouter;
