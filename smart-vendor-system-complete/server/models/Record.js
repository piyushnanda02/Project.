
const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  userId: String,
  type: String,
  category: String,
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Record", RecordSchema);
