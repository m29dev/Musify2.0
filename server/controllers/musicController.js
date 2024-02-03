const { search } = require('../routes/authRoutes')

// GET
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

        data = searchData1

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

        // playlist init
        const url1 = `https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M?si=3c35e4eaa92b4821`

        const playlists = await fetch(url1, { headers })
        const datap = await playlists.json()
        if (!datap) return res.status(400).json({ message: 'err' })

        res.status(200).json(datap)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    playlists_id_get,
    albums_id_get,
    search_query_get,
    search_query_post,
    search_query_advance_get,
    artists_id_get,
    song_init_get,
}
