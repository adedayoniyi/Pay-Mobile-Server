const express = require("express");
const Transactions = require("../models/transaction");
const Notifications = require("../models/notifications_model");
const auth = require("../middlewares/auth");

const notificationsRouter = express.Router();

notificationsRouter.get(
  "/api/credit-notification/:username",
  auth,
  async (req, res) => {
    try {
      const { username } = req.params;
      const transactions = await Transactions.find({
        username: username,
        trnxType: "Credit",
      });
      let showTransactionsFromRecentToLast = transactions.reverse();
      let notifications = await Notifications.create({
        username: showTransactionsFromRecentToLast[0].username,
        trnxType: showTransactionsFromRecentToLast[0].trnxType,
        amount: showTransactionsFromRecentToLast[0].amount,
        sendersName:
          showTransactionsFromRecentToLast[0].fullNameTransactionEntity,
      });
      notifications = await notifications.save();
      res.status(200).json(notifications);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);
notificationsRouter.post("/api/deleteNotification", auth, async (req, res) => {
  try {
    const { username } = req.body;
    await Notifications.findOneAndDelete({ username });
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
module.exports = notificationsRouter;
