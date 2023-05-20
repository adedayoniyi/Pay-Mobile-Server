const Transactions = require("../models/transaction_model");
const User = require("../models/user_model");

const creditAccount = async ({
  amount,
  username,
  purpose,
  reference,
  description,
  session,
  fullNameTransactionEntity,
}) => {
  const user = await User.findOne({ username });

  if (!user) {
    return {
      statusCode: 404,
      message: `The username ${username} isnt recognised`,
    };
  }

  const updatedWallet = await User.findOneAndUpdate(
    { username },
    { $inc: { balance: amount } },
    { session }
  );
  const sendersFullName = await User.findOne({
    username: fullNameTransactionEntity,
  });
  const transaction = await Transactions.create(
    [
      {
        trnxType: "Credit",
        purpose,
        amount,
        username: username,
        reference,
        balanceBefore: Number(user.balance),
        balanceAfter: Number(user.balance) + Number(amount),
        description,
        fullNameTransactionEntity: sendersFullName.fullname,
      },
    ],
    { session }
  );
  console.log(`Credit Successful`);
  return {
    statusCode: 201,
    message: "Credit Successful",
    data: { updatedWallet, transaction },
  };
};

const debitAccount = async ({
  amount,
  username,
  purpose,
  reference,
  description,
  session,
  fullNameTransactionEntity,
}) => {
  const user = await User.findOne({ username });

  if (!user) {
    return {
      statusCode: 404,
      message: `The username ${username} isnt recognised`,
    };
  }

  if (Number(user.balance) < amount) {
    return {
      statusCode: 400,
      message: `You have an insufficient balance`,
    };
  }

  const updatedWallet = await User.findOneAndUpdate(
    { username },
    { $inc: { balance: -amount } },
    { session }
  );
  const recipientFullName = await User.findOne({
    username: fullNameTransactionEntity,
  });
  const transaction = await Transactions.create(
    [
      {
        trnxType: "Debit",
        purpose,
        amount,
        username: username,
        reference,
        balanceBefore: Number(user.balance),
        balanceAfter: Number(user.balance) - Number(amount),
        description,
        fullNameTransactionEntity: recipientFullName.fullname,
      },
    ],
    { session }
  );
  console.log(`Debit Successful`);
  return {
    statusCode: 201,
    message: "Debit Successful",
    data: { updatedWallet, transaction },
  };
};

module.exports = {
  creditAccount,
  debitAccount,
};
