const express = require("express");
const User = require("../models/user_model");
const userRouter = express.Router();

userRouter.get("/admin/getTotalNumberOfAllUsers", async (req, res) => {
  try {
    const totalNumberOfUsers = await User.countDocuments({});
    res.status(200).json(totalNumberOfUsers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

userRouter.get("/admin/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

userRouter.delete("/admin/deleteUser/:username", async (req, res) => {
  try {
    const { username } = req.header;
    await User.findOneAndDelete({ username });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = userRouter;
