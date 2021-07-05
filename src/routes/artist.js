const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist');
const albumController = require('../controllers/album');

router.route('/')
    .post(artistController.create)
    .get(artistController.read)

router.route('/:id') 
    .get(artistController.getById)
    .patch(artistController.update)
    .delete(artistController.delete)

router.post('/:id/album', albumController.create)

module.exports = router;
