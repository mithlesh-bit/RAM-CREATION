const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  heading: String,
  amount: String,
  link: String,
});

module.exports = mongoose.model("creation", listSchema);
