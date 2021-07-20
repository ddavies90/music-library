const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');
const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');

app.use(express.json());

app.use('/artist', artistRouter);

app.use('/album', albumRouter);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = app;