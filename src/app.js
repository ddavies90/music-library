const express = require('express');
const app = express();
const artistRouter = require('./routes/artist');

app.use(express.json());

app.use('/artist', artistRouter);

module.exports = app;