const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album');

router.get('/', albumController.read);

router.route('/:albumId')
    .get(albumController.readById)
    .patch(albumController.update)
    .delete(albumController.delete)

module.exports = router;