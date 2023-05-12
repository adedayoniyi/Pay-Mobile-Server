const express = require("express");
const transactionRouter = express.Router();
const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Transactions = require("../models/transaction");
const { creditAccount, debitAccount } = require("../utils/transactions");
const User = require("../models/user");
const auth = require("../middlewares/auth");

transactionRouter.post("/api/transactions/transfer", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { recipientsUsername, sendersUsername, amount, description } =
      req.body;
    const reference = v4();
    if (!recipientsUsername && !sendersUsername && !amount && !description) {
      return res.status(409).json({
        message: `Please provide the following details: ${recipientsUsername},${sendersUsername}, ${amount}, ${description}`,
      });
    }
    //const sendersFullName = await User.findOne({ sendersUsername });
    //const recipientFullName = await User.findOne({ recipientsUsername });

    const transferResult = await Promise.all([
      debitAccount({
        amount,
        username: sendersUsername,
        purpose: "Transfer",
        reference,
        description,
        session,
        fullNameTransactionEntity: recipientsUsername,
      }),
      creditAccount({
        amount,
        username: recipientsUsername,
        purpose: "Transfer",
        reference,
        description,
        session,
        fullNameTransactionEntity: sendersUsername,
      }),
    ]);

    const failedTxns = transferResult.filter(
      (result) => result.status !== true
    );
    if (failedTxns.length) {
      const errors = failedTxns.map((a) => a.message);
      await session.abortTransaction();
      return res.status(409).json({
        message: errors,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Transfer successful",
      transferResult,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: `Unable to perform transfer. Please try again. \n Error:${err}`,
    });
  }
});

transactionRouter.get(
  "/api/getTransactions/:username",
  auth,
  async (req, res) => {
    try {
      const { username } = req.params;
      const userTransactions = await Transactions.find({
        $or: [{ username: username }, { username: username }],
      });
      let showTransactionsFromRecentToLast = userTransactions.reverse();
      res.status(200).json(showTransactionsFromRecentToLast);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

transactionRouter.post("/api/fundWallet/:username", auth, async (req, res) => {
  try {
    const { username } = req.params;
    /*please note if this will be used with the futter app,
    only integers are allowed, no decimals allowed or an error will be thrown*/
    const { amount } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ mesage: "User not found!!" });
    }
    if (amount > 5000) {
      return res
        .status(400)
        .json({ message: "The maximum amount that can be funded is 5000" });
    }
    await User.findOneAndUpdate(
      { username },
      { balance: user.balance + amount }
    );
    res.status(200).json({ message: "Account funded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = transactionRouter;
