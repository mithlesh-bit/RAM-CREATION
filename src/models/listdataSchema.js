const mongoose = require("mongoose");

const listdataSchema = new mongoose.Schema({
  theme: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  listItem: {
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
});

module.exports = mongoose.model("imageLists", listdataSchema);
