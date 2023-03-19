const express = require("express");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middlewares/auth");

authRouter.post("/api/createUser", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(409).json({
        status: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    user = await user.save();

    // const result = await Wallets.create({ username });
    // console.log(result);
    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: `Unable to create wallet. Please try again.\n Error:${e}`,
    });
  }
});

authRouter.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(409).json({
        status: false,
        message: "This user does not exist",
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(409).json({
        status: false,
        message: "Incorrect password",
      });
    }
    const token = await jwt.sign({ id: user._id }, process.env.TOKEN_STRING);
    res.status(201).json({
      token,
      ...user._doc,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.TOKEN_STRING);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

authRouter.get("/api/getUsername/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(200)
        .json({ message: `${username} username is available` });
    }
    res.status(400).json({ message: "This username has been taken" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

authRouter.get("/api/getUsernameFortransfer/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(200).json({ message: user.fullname });
    }
    res
      .status(400)
      .json({ message: "Invalid username, please check and try again" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = authRouter;
