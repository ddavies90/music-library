const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist');

router.route('/')
    .post(artistController.create)
    .get(artistController.read)

router.route('/:id') 
    .get(artistController.getById)
    .patch(artistController.update)
    .delete(artistController.delete)

module.exports = router;
