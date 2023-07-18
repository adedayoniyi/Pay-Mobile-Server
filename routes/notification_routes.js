const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const User = require("../models/user_model");

router.post("/admin/sendPushNotifications", async (req, res) => {
  try {
    const title = req.body;
    const body = req.body;
    const usersTokens = await User.find().exec();
    const registrationTokens = usersTokens.map((user) => user.deviceToken);
    const messages = {
      tokens: registrationTokens,
      notification: {
        title: title,
        body: body,
      },
    };

    admin
      .messaging()
      .sendEachForMulticast(messages)
      .then((response) => {
        console.log("Successfully sent messages:", response);
        res.send("Notifications sent successfully");
      })
      .catch((error) => {
        console.log("Error sending messages:", error);
        res.status(500).send("Error sending notifications");
      });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;