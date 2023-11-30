const express = require('express')
const controller = require('../controllers/youtubeController.js')

const router = express.Router()

// playlists
router.get('/api/music/youtube/:query', controller.youtube_get)

module.exports = router
