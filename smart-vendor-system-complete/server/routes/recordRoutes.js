
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

// Delete a record
router.delete("/:id", protect, async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    
    // Check ownership (stored as email string in userId field)
    if (record.userId !== req.user.email) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    await Record.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Record Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
