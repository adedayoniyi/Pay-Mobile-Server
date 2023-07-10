const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/api/send", async (req, res) => {
  const registrationToken =
    "fv-wZayUSoKqIGgLuBrZ98:APA91bEQFucnUXYs_PwC9O3EbmCEaJYlhBQrtJnJTsOMx5RE-MT3IoLT9gaB-AKdqtZ9jxYgBI5cOlXrO58HAf1BZEYGLFf77iPtWklPnsNuv3uxuJWXNotzwWiwJ62bMfPjfA5ELWxG";

  const message = {
    notification: {
      title: "Notification Title",
      body: "Notification Body",
    },
    token: registrationToken,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
      res.send("Notification sent successfully");
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.status(500).send("Error sending notification");
    });
});

module.exports = router;
