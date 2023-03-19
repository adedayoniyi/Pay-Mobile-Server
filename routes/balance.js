const express = require("express");
const auth = require("../middlewares/auth");
const User = require("../models/user");

const balanceRouter = express.Router();

balanceRouter.get("/api/balance/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    res.status(200).json({ message: Number(user.balance) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// balanceRouter.get('/api/getTransactions',async(req,res)=>{
//   try{
//     const
//   }catch(err){
//     console.log(err)
//   }
// })

module.exports = balanceRouter;
