// GET

const { search } = require('../routes/authRoutes')

// search for songs / artists / albums / playlists
const search_query_get = async (req, res) => {
    try {
        let { access_token, query, page } = req.params
        let data

        // let page = 1
        let pageOff = 0

        const calcPageOff = () => {
            if (!page) return
            if (page >= 20) return console.log('last page')
            pageOff = page * 50 - 50
        }
        calcPageOff()

        const url1 = `https://api.spotify.com/v1/search?q=${query}&type=track,playlist,album,artist&limit=50&offset=${pageOff}`
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }

        // get 50 items
        const searchResults1 = await fetch(url1, { headers })
        const searchData1 = await searchResults1.json()
        if (!searchData1) return res.status(400).json({ message: 'err' })
        // console.log(searchData1)
        //data = [...data, ...searchData1]
        data = searchData1

        // next 50 items
        // const searchResults2 = await fetch(url2, { headers })
        // const searchData2 = await searchResults2.json()
        // if (!searchData2) return res.status(400).json({ message: 'err' })

        // data.albums.items = [...data.albums.items, ...searchData2.albums.items]
        // data.artists.items = [
        //     ...data.artists.items,
        //     ...searchData2.artists.items,
        // ]
        // data.playlists.items = [
        //     ...data.playlists.items,
        //     ...searchData2.playlists.items,
        // ]
        // data.tracks.items = [...data.tracks.items, ...searchData2.tracks.items]

        // console.log(data.artists.items[0])

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
}

// POST
// search by string / id / link
const search_query_post = async (req, res) => {
    try {
        let { access_token, query, page } = req.body
        let isString
        let id
        let data

        // check if query is link
        if (query?.slice(0, 8) === 'https://') {
            isString = false
            if (query.slice(25, 27) === 'pl') id = query.slice(34)
            if (query.slice(25, 27) === 'al') id = query.slice(31)
            if (query.slice(25, 27) === 'ar') id = query.slice(32)
            if (query.slice(25, 27) === 'tr') id = query.slice(31)
        } else {
            isString = true
        }

        // if query is string
        if (isString) {
            let pageOff = 0
            const calcPageOff = () => {
                if (!page) return
                if (page >= 20) return console.log('last page')
                pageOff = page * 50 - 50
            }
            calcPageOff()
            const url1 = `https://api.spotify.com/v1/search?q=${query}&type=track,playlist,album,artist&limit=50&offset=${pageOff}`
            const headers = {
                Authorization: 'Bearer ' + access_token,
            }
            // get 50 items
            const searchResults1 = await fetch(url1, { headers })
            const searchData1 = await searchResults1.json()
            if (!searchData1) return res.status(400).json({ message: 'err' })
            data = searchData1

            console.log('query is string: ', query)
        }

        // if query is link
        if (!isString) {
            let searchData
            const headers = {
                Authorization: 'Bearer ' + access_token,
            }

            // search for playlist
            if (!searchData) {
                const url1 = `https://api.spotify.com/v1/playlists/${id}`
                const playlist1 = await fetch(url1, { headers })
                const data1 = await playlist1.json()
                if (!data1.error) searchData = data1
            }

            // search for album
            if (!searchData) {
                const url2 = `https://api.spotify.com/v1/albums/${id}`
                const playlist2 = await fetch(url2, { headers })
                const data2 = await playlist2.json()
                if (!data2.error) searchData = data2
            }

            // search for artist
            if (!searchData) {
                const url3 = `https://api.spotify.com/v1/artists/${id}`
                const playlist3 = await fetch(url3, { headers })
                const data3 = await playlist3.json()
                if (!data3.error) searchData = data3
            }

            // search for track
            if (!searchData) {
                const url4 = `https://api.spotify.com/v1/tracks/${id}`
                const playlist4 = await fetch(url4, { headers })
                const data4 = await playlist4.json()
                if (!data4.error) searchData = data4
            }
            data = searchData
            console.log('query is link: ', id)
        }

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
}

const search_query_advance_get = async (req, res) => {
    try {
        let { access_token, query } = req.params
        let searchData
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }

        // search for playlist
        if (!searchData) {
            const url1 = `https://api.spotify.com/v1/playlists/${query}`
            const playlist1 = await fetch(url1, { headers })
            const data1 = await playlist1.json()
            if (!data1.error) searchData = data1
        }

        // search for album
        if (!searchData) {
            const url2 = `https://api.spotify.com/v1/albums/${query}`
            const playlist2 = await fetch(url2, { headers })
            const data2 = await playlist2.json()
            if (!data2.error) searchData = data2
        }

        // search for artist
        if (!searchData) {
            const url3 = `https://api.spotify.com/v1/artists/${query}`
            const playlist3 = await fetch(url3, { headers })
            const data3 = await playlist3.json()
            if (!data3.error) searchData = data3
        }

        // search for track
        if (!searchData) {
            const url4 = `https://api.spotify.com/v1/tracks/${query}`
            const playlist4 = await fetch(url4, { headers })
            const data4 = await playlist4.json()
            if (!data4.error) searchData = data4
        }

        res.json(searchData)
    } catch (err) {
        console.log(err)
    }
}

// GET
// user's playlists
// const playlists_get = async (req, res) => {
//     try {
//         const { access_token } = req.params

//         const url = 'https://api.spotify.com/v1/me/playlists'
//         const headers = {
//             Authorization: 'Bearer ' + access_token,
//         }

//         const playlists = await fetch(url, { headers })
//         const data = await playlists.json()

//         if (!data) return res.status(400).json({ message: 'err' })

//         res.status(200).json(data)
//     } catch (err) {
//         console.log(err)
//     }
// }

// GET
// ID playlist
const playlists_id_get = async (req, res) => {
    try {
        const { access_token } = req.params
        const { id } = req.body

        const url = `https://api.spotify.com/v1/playlists/${id}`
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }

        const playlists = await fetch(url, { headers })
        const data = await playlists.json()

        if (!data) return res.status(400).json({ message: 'err' })

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
}

// GET
// user's albums
// const albums_get = async (req, res) => {
//     try {
//         const { access_token } = req.params

//         const url = 'https://api.spotify.com/v1/me/albums'
//         const headers = {
//             Authorization: 'Bearer ' + access_token,
//         }

//         const albums = await fetch(url, { headers })
//         const data = await albums.json()

//         if (!data) return res.status(400).json({ message: 'err' })

//         res.status(200).json(data)
//     } catch (err) {
//         console.log(err)
//     }
// }

// GET
// ID album
const albums_id_get = async (req, res) => {
    try {
        const { access_token } = req.params
        const { id } = req.body

        const url = `https://api.spotify.com/v1/albums/${id}`
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }

        const album = await fetch(url, { headers })
        const data = await album.json()

        if (!data) return res.status(400).json({ message: 'err' })

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
}

// GET
// saved fav songs
// const songs_saved_get = async (req, res) => {
//     try {
//         const { access_token } = req.params

//         const url = 'https://api.spotify.com/v1/me/tracks'
//         const headers = {
//             Authorization: 'Bearer ' + access_token,
//         }

//         const albums = await fetch(url, { headers })
//         const data = await albums.json()

//         if (!data) return res.status(400).json({ message: 'err' })

//         res.status(200).json(data)
//     } catch (err) {
//         console.log(err)
//     }
// }

// GET
// saved fav artists
// const artists_saved_get = async (req, res) => {
//     try {
//         const { access_token } = req.params

//         const url = 'https://api.spotify.com/v1/me/following?type=artist'
//         const headers = {
//             Authorization: 'Bearer ' + access_token,
//         }

//         const artists = await fetch(url, { headers })
//         const data = await artists.json()

//         if (!data) return res.status(400).json({ message: 'err' })

//         res.status(200).json(data)
//     } catch (err) {
//         console.log(err)
//     }
// }

// GET
// artists id
const artists_id_get = async (req, res) => {
    try {
        const { access_token } = req.params
        const { id } = req.body

        // artist info
        const url = `https://api.spotify.com/v1/artists/${id}`
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }
        const artist = await fetch(url, { headers })
        const data = await artist.json()
        if (!data) return res.status(400).json({ message: 'err' })

        // artist albums
        const urlAlbums = `https://api.spotify.com/v1/artists/${id}/albums`
        const artistAlbums = await fetch(urlAlbums, { headers })
        const dataAlbums = await artistAlbums.json()
        if (!dataAlbums) return res.status(400).json({ message: 'err' })

        // artist albums
        const urlTracks = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=PL`
        const artistTracks = await fetch(urlTracks, { headers })
        const dataTracks = await artistTracks.json()
        if (!dataTracks) return res.status(400).json({ message: 'err' })

        const dataObject = {
            id: data?.id,
            name: data?.name,
            images: data?.images,
            type: data?.type,
            albums: dataAlbums?.items,
            tracks: dataTracks?.tracks,
        }

        res.status(200).json(dataObject)
    } catch (err) {
        console.log(err)
    }
}

// GET
// top song
// const user_top_song_get = async (req, res) => {
//     try {
//         const { access_token } = req.params

//         // top songs
//         const url = `https://api.spotify.com/v1/me/top/tracks`
//         const headers = {
//             Authorization: 'Bearer ' + access_token,
//         }
//         const topSongs = await fetch(url, { headers })
//         let data = await topSongs.json()

//         if (!data) return res.status(400).json({ message: 'err' })

//         if (data.items.length === 0) {
//             const song = await fetch(
//                 `https://api.spotify.com/v1/tracks/1rh232CwAy3EDEWFJkwH88`,
//                 { headers }
//             )
//             const songData = await song.json()

//             const songObject = { items: [songData] }
//             data = songObject
//         }

//         res.status(200).json(data)
//     } catch (err) {
//         console.log(err)
//     }
// }

// GET
// init song
const song_init_get = async (req, res) => {
    try {
        const { access_token } = req.params

        // song init
        const url = `https://api.spotify.com/v1/tracks/40riOy7x9W7GXjyGp4pjAv`
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }
        const songInit = await fetch(url, { headers })
        let data = await songInit.json()

        if (!data) return res.status(400).json({ message: 'err' })

        // if (
        //     data?.error?.status === 401 &&
        //     data?.error?.message === 'The access token expired'
        // ) {
        //     return console.log('405 init refresh token')
        // }

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    // playlists_get,
    playlists_id_get,
    // albums_get,
    albums_id_get,
    // songs_saved_get,
    search_query_get,
    search_query_post,
    search_query_advance_get,
    // artists_saved_get,
    artists_id_get,
    // user_top_song_get,
    song_init_get,
}
