const express = require("express");
const router = express.Router();
const firebaseAdmin = require("firebase-admin");
const User = require("../models/user_model");
const admin = require("../middlewares/admin_middleware");

router.post("/admin/sendPushNotifications", admin, async (req, res) => {
  try {
    const { title, body } = req.body;

    const usersTokens = await User.find().exec();
    let registrationTokens = usersTokens.map((user) => user.deviceToken);
    registrationTokens = registrationTokens.filter(
      (token) => token !== null && token !== undefined && token !== ""
    );

    console.log(registrationTokens);

    const messages = {
      tokens: registrationTokens,
      notification: {
        title: title,
        body: body,
      },
    };

    firebaseAdmin
      .messaging()
      .sendEachForMulticast(messages)
      .then((response) => {
        console.log("Successfully sent messages:", response);
        res.status(200).json({ message: "Notifications sent successfully" });
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
