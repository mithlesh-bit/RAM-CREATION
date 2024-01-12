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
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  lastUpdate: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("images", imageSchema);
