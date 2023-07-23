const User = require("../models/user_model");
const jwt = require("jsonwebtoken");

const admin = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (token) {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_STRING);
      const user = await User.findById(verified.id);
      if (user && (user.type === "admin" || user.type === "agent")) {
        req.user = verified.id;
        req.token = token;
        next();
      } else {
        res.status(401).json({ message: "Access denied" });
      }
    } catch (errs) {
      res.status(401).json({ message: "Token not verified, access denied" });
    }
  } else {
    res.status(401).json({ message: "No auth token, access denied" });
  }
};

module.exports = {
  admin,
};
