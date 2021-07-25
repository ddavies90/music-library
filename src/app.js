const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');
const artistRouter = require('./routes/artists');
const albumRouter = require('./routes/albums');

app.use(cors());

app.use(express.json());

app.use('/artists', artistRouter);

app.use('/albums', albumRouter);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = app;