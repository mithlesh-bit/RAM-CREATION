const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    subject: String,
    message: String,
    date: String
});

module.exports = mongoose.model("contactUs", contactSchema);