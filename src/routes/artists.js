const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artists');
const albumController = require('../controllers/albums');

router.route('/')
    .post(artistController.create)
    .get(artistController.read)

router.route('/:id') 
    .get(artistController.getById)
    .patch(artistController.update)
    .delete(artistController.delete)

router.post('/:artistId/albums', albumController.create)

module.exports = router;
