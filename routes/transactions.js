const express = require("express");
const transactionRouter = express.Router();
const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Transactions = require("../models/transaction");
const { creditAccount, debitAccount } = require("../utils/transactions");

transactionRouter.post("/api/transactions/transfer", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { toUsername, fromUsername, amount, summary } = req.body;
    const reference = v4();
    if (!toUsername && !fromUsername && !amount && !summary) {
      return res.status(409).json({
        status: false,
        message:
          "Please provide the following details: toUsername,fromUsername, amount, summary",
      });
    }

    const transferResult = await Promise.all([
      debitAccount({
        amount,
        username: fromUsername,
        purpose: "transfer",
        reference,
        summary,
        trnxSummary: `TRFR TO:${toUsername}. TRNX REF:${reference}`,
        session,
      }),
      creditAccount({
        amount,
        username: toUsername,
        purpose: "transfer",
        reference,
        summary,
        trnxSummary: `TRFR FROM:${fromUsername}. TRNX REF:${reference}`,
        session,
      }),
    ]);

    const failedTxns = transferResult.filter(
      (result) => result.status !== true
    );
    if (failedTxns.length) {
      const errors = failedTxns.map((a) => a.message);
      await session.abortTransaction();
      return res.status(409).json({
        status: false,
        message: errors,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: "Transfer successful",
      transferResult,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `Unable to find perform transfer. Please try again. \n Error:${err}`,
    });
  }
});

transactionRouter.get("/api/getTransactions/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const userTransactions = await Transactions.find({
      $or: [{ username: username }, { username: username }],
    });
    res.status(200).json(userTransactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = transactionRouter;
