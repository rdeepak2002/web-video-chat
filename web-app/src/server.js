// import sslRedirect from "heroku-ssl-redirect";
// import path from "path";
// import express from "express";
// import rateLimit from "express-rate-limit";
const path = require("path");
const express = require("express");

const app = express(); // create express app

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Web app server is listening at http://localhost:${PORT}`);
});