const express = require('express');
const app = express();
const artistRouter = require('./routes/artist');

app.use(express.json());

app.use('/artist', artistRouter);

// process.on('unhandledRejection', error => {
//     console.log('unhandledRejection', error)
// });

module.exports = app;