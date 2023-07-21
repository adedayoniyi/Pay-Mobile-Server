const mongoose = require("mongoose");

const adminAuthPinSchema = mongoose.Schema({
  admin: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
    unique: true,
  },
});
const AdminAuthPin = mongoose.model("AdminAuthPin", adminAuthPinSchema);
module.exports = AdminAuthPin;
