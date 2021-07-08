const express = require('express');
const app = express();
const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');

app.use(express.json());

app.use('/artist', artistRouter);

app.use('/album', albumRouter);

// process.on('unhandledRejection', error => {
//     console.log('unhandledRejection', error)
// });

module.exports = app;