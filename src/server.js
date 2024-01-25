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
app.set('views', path.join("./views", 'views'));
app.use(router);



app.listen(process.env.port, () => {
    console.log(`Server running on port 5000`);
}).on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log(`Port ${process.env.port} is in use, trying another port`);
        app.listen(process.env.port + 1, () => {
            console.log(`Server running on port ${process.env.port + 1}`);
        });
    } else {
        console.error(e);
    }
});


