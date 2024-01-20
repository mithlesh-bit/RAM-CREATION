const mongoose = require('mongoose');

const db = mongoose.connect(process.env.dburl)
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log("failed to connect db", error);
  });

module.exports = db;
