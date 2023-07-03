const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/api/send", async (req, res) => {
  const registrationToken =
    "dtenP8cuR6KyyObGQWfucn:APA91bG16AAUAIimqQA8TPc9PSeHSkH3STovgR2aKkY1Yrh7edDkc3VNlFvfyNuo_yfMaWc-lANeiQWlBlj059OAOqqiI_dCCnQFoABtiDlPM3pF21EsJpDYcmJAL5uTbDcY41qqncqT";

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
