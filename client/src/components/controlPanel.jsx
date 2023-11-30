import { useDispatch, useSelector } from 'react-redux'
import {
    setDurationVideo,
    setOnChangeDuration,
    setPlayVideo,
    setSongInfo,
    setVolumeVideo,
} from '../redux/authSlice'
import { useGetSongIdMutation } from '../services/musicService'
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs'
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi'
import { BsFillVolumeDownFill } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ControlPanel = () => {
    const { songInfo, controlPanelInfo, authInfo } = useSelector(
        (state) => state.auth
    )
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [getSong] = useGetSongIdMutation()
    const [duration, setDuration] = useState(0)

    const changeSong = async (direction) => {
        try {
            let index = songInfo?.index

            // check if current song is last playlist's item and direction is next
            if (
                index ===
                    songInfo?.spotify_playlist?.tracks?.items?.length - 1 &&
                direction === 'next'
            ) {
                index = -1
            }

            // check if current song is first playlist's item and direction is previous
            if (index === 0 && direction === 'previous') {
                index = songInfo?.spotify_playlist?.tracks?.items?.length
            }

            let song
            if (songInfo?.spotify_playlist?.type === 'playlist') {
                song =
                    direction === 'next'
                        ? songInfo.spotify_playlist?.tracks?.items[index + 1]
                              ?.track
                        : songInfo.spotify_playlist?.tracks?.items[index - 1]
                              ?.track
            }
            if (songInfo?.spotify_playlist?.type === 'album') {
                song =
                    direction === 'next'
                        ? songInfo.spotify_playlist?.tracks?.items[index + 1]
                        : songInfo.spotify_playlist?.tracks?.items[index - 1]
            }
            const songArtist = song?.artists[0]?.name
            const songName = song?.name

            let songSearch = `${songArtist} - ${songName}`
            if (songSearch.includes('/')) {
                songSearch = songSearch.replace('/', '')
            }

            const res = await getSong(songSearch).unwrap()

            const songInfoObject = {
                index: direction === 'next' ? index + 1 : index - 1,
                spotify_playlist: songInfo.spotify_playlist,
                spotify_song: song,
                youtube_song: res,
            }
            dispatch(setSongInfo(songInfoObject))
            dispatch(setDurationVideo(0))
        } catch (err) {
            console.log(err)
            if (err.data.message) {
                window.alert(err.data.message)
            }
        }
    }

    const updatePlayVideo = (boolean) => {
        dispatch(setPlayVideo(boolean))
    }

    const updateVolume = (volume) => {
        dispatch(setVolumeVideo(volume))
    }

    const changeDuration = (event) => {
        setDuration(Math.trunc(event.target.value))
        dispatch(setOnChangeDuration(Math.trunc(event.target.value)))
    }

    function fancyTimeFormat(duration) {
        const mins = ~~((duration % 3600) / 60)
        const secs = ~~duration % 60
        let ret = ''
        ret += '' + mins + ':' + (secs < 10 ? '0' : '')
        ret += '' + secs
        return ret
    }

    useEffect(() => {
        // on duration updates set duration variable
        setDuration(controlPanelInfo?.durationVideo)
    }, [controlPanelInfo])
    return (
        <>
            {/* CONTROL PANEL */}
            {songInfo && authInfo && (
                <>
                    <div className="control-panel-box-absolute">
                        {/* left bar */}
                        <div className="control-panel-left">
                            {/* title */}
                            {songInfo?.spotify_song && (
                                <>
                                    <div className="control-panel-title">
                                        <h1>{songInfo?.spotify_song?.name}</h1>
                                        <div className="title-artists-box">
                                            {songInfo?.spotify_song?.artists.map(
                                                (artist, index) => {
                                                    return (
                                                        <h4
                                                            key={artist?.name}
                                                            onClick={() => {
                                                                navigate(
                                                                    `/artists/${artist?.id}`
                                                                )
                                                            }}
                                                            className="artist-link"
                                                        >
                                                            {index > 0
                                                                ? `, ${artist?.name}`
                                                                : `${artist?.name}`}
                                                        </h4>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* center bar */}
                        <div className="control-panel-center">
                            {/* upper bar */}
                            <div className="control-panel-btn-box">
                                <BiSkipPrevious
                                    className="control-panel-btn"
                                    onClick={() => {
                                        changeSong('previous')
                                    }}
                                ></BiSkipPrevious>

                                <BsFillPlayCircleFill
                                    onClick={() => {
                                        updatePlayVideo(true)
                                    }}
                                    className="control-panel-btn"
                                ></BsFillPlayCircleFill>

                                <BsFillPauseCircleFill
                                    onClick={() => {
                                        updatePlayVideo(false)
                                    }}
                                    className="control-panel-btn"
                                ></BsFillPauseCircleFill>

                                <BiSkipNext
                                    className="control-panel-btn"
                                    onClick={() => {
                                        changeSong('next')
                                    }}
                                ></BiSkipNext>
                            </div>

                            {/* lower bar */}
                            <div className="control-panel-duration-box">
                                <div className="control-panel-current-duration">
                                    {fancyTimeFormat(
                                        controlPanelInfo?.durationVideo
                                    )}
                                </div>

                                <input
                                    type="range"
                                    min={0}
                                    max={
                                        songInfo?.spotify_song?.duration_ms
                                            ? songInfo?.spotify_song
                                                  ?.duration_ms / 1000
                                            : ''
                                    }
                                    step={0.01}
                                    value={duration}
                                    className="control-panel-range"
                                    onChange={(event) => {
                                        changeDuration(event)
                                    }}
                                />
                                <div className="control-panel-duration">
                                    {fancyTimeFormat(
                                        songInfo?.spotify_song?.duration_ms /
                                            1000
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* right bar */}
                        <div className="control-panel-right">
                            <div className="control-panel-volume-box">
                                <BsFillVolumeDownFill className="control-panel-btn"></BsFillVolumeDownFill>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.02}
                                    value={controlPanelInfo?.volumeVideo}
                                    onChange={(event) => {
                                        updateVolume(event.target.valueAsNumber)
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* mobile screen version */}
                    <div className="control-panel-box-mobile">
                        {/* top box - song info (img, title), control btns */}
                        <div className="control-panel-box-mobile-top">
                            {/* title */}
                            {songInfo?.spotify_song && (
                                <>
                                    <div className="control-panel-title">
                                        <h1>{songInfo?.spotify_song?.name}</h1>
                                        <div className="title-artists-box">
                                            {songInfo?.spotify_song?.artists.map(
                                                (artist, index) => {
                                                    return (
                                                        <h4
                                                            key={artist?.name}
                                                            onClick={() => {
                                                                navigate(
                                                                    `/artists/${artist?.id}`
                                                                )
                                                            }}
                                                            className="artist-link"
                                                        >
                                                            {index > 0
                                                                ? `, ${artist?.name}`
                                                                : `${artist?.name}`}
                                                        </h4>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* control btns */}
                            <div className="control-panel-btn-box-mobile">
                                <BiSkipPrevious
                                    className="control-panel-btn"
                                    onClick={() => {
                                        changeSong('previous')
                                    }}
                                ></BiSkipPrevious>

                                <BsFillPlayCircleFill
                                    onClick={() => {
                                        updatePlayVideo(true)
                                    }}
                                    className="control-panel-btn"
                                ></BsFillPlayCircleFill>

                                <BsFillPauseCircleFill
                                    onClick={() => {
                                        updatePlayVideo(false)
                                    }}
                                    className="control-panel-btn"
                                ></BsFillPauseCircleFill>

                                <BiSkipNext
                                    className="control-panel-btn"
                                    onClick={() => {
                                        changeSong('next')
                                    }}
                                ></BiSkipNext>
                            </div>
                        </div>

                        {/* bottom box - progress input */}
                        <div className="control-panel-box-mobile-bottom">
                            <input
                                type="range"
                                min={0}
                                max={
                                    songInfo?.spotify_song?.duration_ms
                                        ? songInfo?.spotify_song?.duration_ms /
                                          1000
                                        : ''
                                }
                                step={0.01}
                                value={duration}
                                className="control-panel-range"
                                onChange={(event) => {
                                    changeDuration(event)
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ControlPanel
