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



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use, trying another port`);
        app.listen(PORT + 1, () => {
            console.log(`Server running on port ${PORT + 1}`);
        });
    } else {
        console.error(e);
    }
});


