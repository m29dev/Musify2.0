import Navbar from '../components/navbar'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearAuthInfo,
    setFullScreenMode,
    setSongInfo,
} from '../redux/authSlice'
import { BsGithub } from 'react-icons/bs'
import {
    useGetSongIdMutation,
    useGetSongInitMutation,
} from '../services/musicService'

const Home = () => {
    const { authInfo, songInfo } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    // on HomePage init set fullScreen mode to true
    useEffect(() => {
        dispatch(setFullScreenMode(true))
    }, [dispatch])

    // on HomePage exit set fullScreen mode to false
    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            dispatch(setFullScreenMode(false))
        }
    }, [dispatch])

    // FETCH INIT PLAYLIST (IF SONGINFO IS NULL)
    const [getSong] = useGetSongIdMutation()
    const [initSong] = useGetSongInitMutation()
    const runInitSong = useCallback(async () => {
        try {
            const playlist = await initSong(authInfo?.access_token).unwrap()
            console.log('playlist_TEST: ', playlist)

            if (
                playlist?.error?.status === 401 &&
                playlist?.error?.message === 'The access token expired'
            ) {
                dispatch(clearAuthInfo())
            }

            const song = playlist?.tracks?.items[0]?.track
            const songArtist = song?.artists[0]?.name
            const songName = song?.name

            let songSearch = `${songArtist} - ${songName}`
            if (songSearch.includes('/')) {
                songSearch = songSearch.replace('/', '')
            }

            const res = await getSong(songSearch).unwrap()
            const songInfoObject = {
                index: 0,
                spotify_playlist: playlist,
                spotify_song: song,
                youtube_song: res,
            }
            dispatch(setSongInfo(songInfoObject))
        } catch (err) {
            console.log(err)
        }
    }, [initSong, getSong, authInfo, dispatch])

    useEffect(() => {
        if (!songInfo) {
            runInitSong()
        }
    }, [songInfo, runInitSong])

    return (
        <div
            className="center-box test-home-page"
            style={
                authInfo
                    ? {}
                    : {
                          maxWidth: '100%',
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                      }
            }
        >
            {/* navbar main */}
            <Navbar></Navbar>

            {!authInfo && (
                <div className="welcome-box">
                    <div className="welcome-brand">
                        <h1 className="welcome-h1">Musify</h1>
                    </div>
                    <h2 className="welcome-h2">
                        Just the place for true music listeners.
                    </h2>
                </div>
            )}

            {!authInfo && (
                <div className="about-info home-about-info">
                    <a href="https://github.com/m29dev/Musify">
                        Musify <BsGithub></BsGithub>
                    </a>
                    <h4>©Michał Majchrzak, 2023.</h4>
                </div>
            )}
        </div>
    )
}

export default Home
