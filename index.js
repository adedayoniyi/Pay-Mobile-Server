const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
dotenv.config();
const authRouter = require("./routes/auth_routes");
const balanceRouter = require("./routes/balance_routes");
const transactionRouter = require("./routes/transactions_route");
const notifications = require("./routes/notification_routes");
const userRouter = require("./routes/user_routes");
const cors = require("cors");

const serviceAccountPath =
  "./pay-mobile-firebase-adminsdk.json" ||
  "/etc/secrets/pay-mobile-firebase-adminsdk.json";
var serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL,
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(transactionRouter);
app.use(balanceRouter);
app.use(notifications);
app.use(userRouter);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch((e) => {
    console.log("Unable to connect to MongoDB");
  });

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
