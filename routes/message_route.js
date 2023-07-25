const express = require("express");
const Chat = require("../models/chat_model");
const Message = require("../models/message_model");
const admin = require("../middlewares/admin_middleware");
const messageRouter = express.Router();

messageRouter.get("/chat/:chatId/messages", async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

messageRouter.post("/message", async (req, res) => {
  const { sender, content, receiver, chat } = req.body;
  try {
    const message = new Message({ sender, content, receiver, chat });
    await message.save();
    await Chat.findByIdAndUpdate(chat, { latestMessage: content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = messageRouter;
