const mongoose = require("mongoose");
const { transactionSchema } = require("./transaction");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      required: true,
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      //immutable: true,
      unique: true,
      index: true,
      sparse: true,
    },
    email: {
      required: true,
      type: String,
      trim: true,
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
    },
    password: {
      required: true,
      type: String,
    },
    balance: {
      type: mongoose.Decimal128,
      required: true,
      default: 0.0,
    },
    type: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
