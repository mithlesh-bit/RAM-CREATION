const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const db = require("./db/connection");
const router = require("./router/router");
const ejs = require("ejs");

const app = express();
const port = process.env.port || 3000;
const cookieParser = require("cookie-parser");

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(router);

app.listen(process.env.port, function (err) {
  mongoose.db;
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", port);
});
