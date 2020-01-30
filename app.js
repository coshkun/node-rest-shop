const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        err: 0,
        message: "It works!"
    })
});

module.exports = app;