require('dotenv').config();
const express = require('express');
const musicController = require('../controllers/music.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});
const router = express.Router();
console.log("authArtist:", authMiddleware.authArtist);
console.log("authUser:", authMiddleware.authUser);
console.log("createMusic:", musicController.createMusic);
console.log("createAlbum:", musicController.createALbum);

router.post('/upload',authMiddleware.authArtist ,upload.single('music'), musicController.createMusic);
router.post('/album', authMiddleware.authArtist, musicController.createALbum);
router.get('/',authMiddleware.authUser ,musicController.getAllMusics);
router.get('/album', authMiddleware.authUser, musicController.getAllAlbums);
router.get('/albums/:albumId', authMiddleware.authUser, musicController.getAlbumById);

module.exports = router;