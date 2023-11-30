import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { setDurationVideo, setSongInfo } from '../redux/authSlice'
import { useGetSongIdMutation } from '../services/musicService'
import { useEffect, useRef, useState } from 'react'

const YoutubePlayer = () => {
    const {
        songInfo,
        controlPanelInfo,
        onChangeDuration,
        fullScreenMode,
        hideRightbar,
    } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [getSong] = useGetSongIdMutation()

    const nextSong = async () => {
        try {
            let index = songInfo?.index
            // check if current song is last playlist's item
            if (
                index ===
                songInfo?.spotify_playlist?.tracks?.items?.length - 1
            ) {
                index = -1
            }

            let song
            if (songInfo?.spotify_playlist?.type === 'playlist') {
                song =
                    songInfo.spotify_playlist?.tracks?.items[index + 1]?.track
            }
            if (songInfo?.spotify_playlist?.type === 'album') {
                song = songInfo.spotify_playlist?.tracks?.items[index + 1]
            }
            const songArtist = song?.artists[0]?.name
            const songName = song?.name

            const res = await getSong(`${songArtist} - ${songName}`).unwrap()

            const songInfoObject = {
                index: index + 1,
                spotify_playlist: songInfo.spotify_playlist,
                spotify_song: song,
                youtube_song: res,
            }

            dispatch(setSongInfo(songInfoObject))
        } catch (err) {
            console.log(err)
            if (err.data.message) {
                window.alert(err.data.message)
            }
        }
    }

    const durationProgress = (e) => {
        const countProgress = Math.trunc(e.playedSeconds)
        dispatch(setDurationVideo(countProgress))
    }

    const videoPlayerRef = useRef(null)

    useEffect(() => {
        videoPlayerRef.current.seekTo(onChangeDuration?.durationVideo)
    }, [onChangeDuration])

    const [classVar, setClassVar] = useState('flr')

    useEffect(() => {
        if (window.innerWidth > 1500) {
            if (fullScreenMode) setClassVar('player-home-page')
            if (!fullScreenMode && !hideRightbar) setClassVar('player-rightbar')
            if (!fullScreenMode && hideRightbar) setClassVar('player-hidden')
        }

        if (window.innerWidth <= 1500) {
            if (fullScreenMode) setClassVar('player-home-page')
            if (!fullScreenMode) setClassVar('player-hidden')
        }

        // if (!fullScreenMode && !hideLeftbar && !hideRightbar) setClassVar('_lr')
        // if (!fullScreenMode && hideLeftbar && !hideRightbar) setClassVar('__r')
        // if (!fullScreenMode && !hideLeftbar && hideRightbar)
        //     setClassVar('player-hidden')
        // if (!fullScreenMode && hideLeftbar && hideRightbar)
        //     setClassVar('player-hidden')
    }, [fullScreenMode, hideRightbar])

    return (
        <>
            {/* YOUTUBE PLAYER */}
            <div className={classVar}>
                <ReactPlayer
                    ref={videoPlayerRef}
                    url={`https://www.youtube.com/embed/${songInfo?.youtube_song?.id?.videoId}`}
                    playing={controlPanelInfo?.playVideo}
                    volume={controlPanelInfo?.volumeVideo}
                    onProgress={durationProgress}
                    onEnded={() => {
                        nextSong()
                    }}
                    width={`100%`}
                    height={`100%`}
                ></ReactPlayer>
            </div>
        </>
    )
}

export default YoutubePlayer
