const express = require("express");
const Chat = require("../models/chat_model");
const User = require("../models/user_model");
const chatRouter = express.Router();

chatRouter.post("/api/chat", async (req, res) => {
  const { sender, receiver, chatName } = req.body;
  try {
    const chat = await Chat.findOne({
      $or: [
        { $and: [{ sender: sender }, { receiver: receiver }] },
        { $and: [{ sender: receiver }, { receiver: sender }] },
      ],
    });
    if (!chat) {
      const agents = await User.find({ type: "agent" });
      if (agents.length === 0) {
        return res.status(400).json({ message: "No agents found" });
      }
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const newChat = new Chat({
        sender,
        receiver: randomAgent.username,
        chatName,
      });
      await newChat.save();
      const initialMessage = new Message({
        sender: sender,
        content:
          "Welcome to Pay Mobile customer support center, send us a message and we will reply as soon as possible",
        receiver: randomAgent.username,
        chat: newChat._id,
      });
      await initialMessage.save();

      res.status(201).json(newChat);
    } else {
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

chatRouter.get("/admin/getAllChats", async (req, res) => {
  try {
    const allChats = await Chat.find({});
    res.status(200).json(allChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
chatRouter.get("/admin/getAgentChat/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const agentChat = await Chat.find({ receiver: username });
    if (agentChat.length == 0) {
      return res.status(400).json({ message: "No chats found" });
    }
    res.status(200).json(agentChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = chatRouter;
