const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  thumbnail_id: String,
  links: [String],
});

module.exports = mongoose.model("creation", listSchema);
