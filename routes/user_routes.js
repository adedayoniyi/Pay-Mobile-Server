const express = require("express");
const User = require("../models/user_model");
const bcryptjs = require("bcryptjs");
const AdminAuthPin = require("../models/admin_auth_pin_model");
const userRouter = express.Router();
const { admin, agent } = require("../middlewares/admin_middleware");

userRouter.get("/admin/getTotalNumberOfAllUsers", admin, async (req, res) => {
  try {
    const totalNumberOfUsers = await User.countDocuments({});
    res.status(200).json(totalNumberOfUsers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

userRouter.get("/admin/getAllUsers", admin, async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

userRouter.delete("/admin/deleteUser/:username", admin, async (req, res) => {
  try {
    const { username } = req.params;
    await User.findOneAndDelete({ username });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

userRouter.get("/admin/getAllAdmin", async (req, res) => {
  try {
    const allAdmins = await User.find({ type: "admin" || "agent" });
    res.status(200).json(allAdmins);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

userRouter.post("/admin/createAdmin", async (req, res) => {
  try {
    const { fullname, username, email, password, type } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({
        message: "Admin or User already exists",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
      type: type,
    });
    user = await user.save();

    return res.status(201).json({
      message: "Admin created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: `Unable to create admin. Please try again.\n Error:${e}`,
    });
  }
});

userRouter.delete("/admin/deleteAdmin", async (req, res) => {
  try {
    const { authorizationPin, username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User or Admin not found" });
    }
    const adminAuthPin = await AdminAuthPin.findOne({ pin: authorizationPin });
    const isMatch = bcryptjs.compare(authorizationPin, adminAuthPin.pin);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect Admin Authorization Pin" });
    }
    await User.findOneAndDelete({ username });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = userRouter;
