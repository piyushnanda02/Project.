
const router = require("express").Router();
const Record = require("../models/Record");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, async (req,res)=>{
  const record = new Record(req.body);
  await record.save();
  res.json("Record Added");
});

router.get("/:userId", protect, async (req,res)=>{
  // Ensure user can only access their own records
  if (req.params.userId !== req.user.email) {
    return res.status(403).json({ message: "Access denied" });
  }
  const records = await Record.find({userId:req.params.userId});
  res.json(records);
});

module.exports = router;
