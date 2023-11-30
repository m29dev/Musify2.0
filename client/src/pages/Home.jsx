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

    // const [topSongs] = useGetSongsTopMutation()
    const [getSong] = useGetSongIdMutation()
    const [initSong] = useGetSongInitMutation()
    const runInitSong = useCallback(async () => {
        try {
            const res = await initSong(authInfo?.access_token).unwrap()
            console.log('RES_TEST: ', res)

            if (
                res?.error?.status === 401 &&
                res?.error?.message === 'The access token expired'
            ) {
                dispatch(clearAuthInfo())
            }

            const songArtist = res?.artists?.[0]?.name
            const songName = res?.name

            const resYt = await getSong(`${songArtist} - ${songName}`).unwrap()

            const songInfoObject = {
                index: 0,
                spotify_playlist: {
                    tracks: { items: res?.items },
                    type: res?.album?.type,
                    name: res?.album?.name,
                    images: res?.album?.images,
                },
                spotify_song: res?.items?.[0],
                youtube_song: resYt,
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
