const express = require('express')
const controller = require('../controllers/musicController.js')

const router = express.Router()

// playlists
// router.get('/api/music/playlists/:access_token', controller.playlists_get)
router.post('/api/music/playlists/:access_token', controller.playlists_id_get)

// albums
// router.get('/api/music/albums/:access_token', controller.albums_get)
router.post('/api/music/albums/:access_token', controller.albums_id_get)

// songs
// router.get('/api/music/songs/saved/:access_token', controller.songs_saved_get)
// router.get('/api/music/songs/top/:access_token', controller.user_top_song_get)
router.get('/api/music/songs/init/:access_token', controller.song_init_get)

// search
router.get(
    '/api/music/search/advance/:access_token/:query',
    controller.search_query_advance_get
)
router.post('/api/music/search', controller.search_query_post)
router.get(
    '/api/music/search/:access_token/:query/:page',
    controller.search_query_get
)

// artists
// router.get(
//     '/api/music/artists/saved/:access_token',
//     controller.artists_saved_get
// )
router.post('/api/music/artists/:access_token', controller.artists_id_get)

module.exports = router
