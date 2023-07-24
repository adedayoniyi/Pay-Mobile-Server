const express = require("express");
const auth = require("../middlewares/auth_middleware");
const User = require("../models/user_model");
const admin = require("../middlewares/admin_middleware");

const balanceRouter = express.Router();

balanceRouter.get("/api/balance/:username", auth, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    res.status(200).json({ message: Number(user.balance) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

balanceRouter.get("/admin/getTotalUserBalance", admin, async (req, res) => {
  try {
    const totalBalance = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);
    res.json(totalBalance[0].total);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = balanceRouter;
