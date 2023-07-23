const express = require("express");
const Chat = require("../models/chat_model");
const User = require("../models/user_model");
const admin = require("../middlewares/admin_middleware");
const Message = require("../models/message_model");
const chatRouter = express.Router();

chatRouter.post("/api/chat", async (req, res) => {
  const { sender, chatName } = req.body;
  const initialMessageContent =
    "Welcome to Pay Mobile customer support center, send us a message and we will reply as soon as possible";
  try {
    const agents = await User.find({ type: "agent" });
    if (agents.length === 0) {
      return res.status(400).json({ message: "No agents found" });
    }
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const chat = await Chat.findOne({
      $or: [
        { $and: [{ sender: sender }, { receiver: randomAgent.username }] },
        { $and: [{ sender: randomAgent.username }, { receiver: sender }] },
      ],
    });
    if (!chat) {
      const newChat = new Chat({
        sender,
        receiver: randomAgent.username,
        chatName,
      });
      await newChat.save();
      const initialMessage = new Message({
        sender: randomAgent.username,
        content: initialMessageContent,
        receiver: sender,
        chat: newChat._id,
      });
      await initialMessage.save();
      await Chat.findByIdAndUpdate(chat._id, {
        latestMessage: initialMessageContent,
      });
      res.status(201).json(newChat);
    } else {
      console.log("Chat Exists!!");
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

chatRouter.get("/admin/getAllChats", admin, async (req, res) => {
  try {
    const allChats = await Chat.find({});
    res.status(200).json(allChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
chatRouter.get("/admin/getAgentChat/:username", admin, async (req, res) => {
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
