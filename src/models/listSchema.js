const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  thumbnail_id: String,
  theme: String,
  amount: String,
  link: String,
});

module.exports = mongoose.model("creation", listSchema);
