const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  youtubelink: {
    type: String,
    required: false,
  },
  images: String,
  lastUpdate: {
    type: String,
    required: true,
  },
  youtubelink: String,
});

module.exports = mongoose.model("images", imageSchema);
