const express = require("express");
const Transactions = require("../models/transaction");

const notificationsRouter = express.Router();

notificationsRouter.get("/credit-notification/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const transactions = await Transactions.find({
      username: username,
      trnxType: "Credit",
    });
    let showTransactionsFromRecentToLast = transactions.reverse();
    res.json(showTransactionsFromRecentToLast);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
module.exports = notificationsRouter;
