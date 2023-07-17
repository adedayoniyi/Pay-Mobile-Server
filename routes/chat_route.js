const express = require("express");
const Chat = require("../models/Chat");
const chatRouter = express.Router();

chatRouter.post("/chat", async (req, res) => {
  const { sender, receiver, chatName } = req.body;
  try {
    const chat = await Chat.findOne({ sender, receiver });

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
