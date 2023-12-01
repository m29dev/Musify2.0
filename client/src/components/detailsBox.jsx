// for PLAYLIST's details / ALBUM's details
import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetSongIdMutation } from '../services/musicService'
import { useDispatch, useSelector } from 'react-redux'
import { setSongInfo } from '../redux/authSlice'

const DetailsBox = (playlistData) => {
    const { songInfo } = useSelector((state) => state.auth)
    const playlist = playlistData.playlist
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const navTo = (id) => {
        navigate(`${id}`)
    }

    // convers ms to min : sec
    const convertTime = (ms) => {
        let min = ms / 1000 / 60
        let r = min % 1
        let sec = Math.floor(r * 60)
        if (sec < 10) {
            sec = '0' + sec
        }
        min = Math.floor(min)
        return <div className="column time">{`${min}:${sec}`}</div>
    }

    const [getSong] = useGetSongIdMutation()
    const runPlayer = async (playlist, index) => {
        try {
            // if track's from playlist
            if (playlist?.type === 'playlist') {
                const song = playlist?.tracks?.items[index]?.track
                const songArtist = song?.artists[0]?.name
                const songName = song?.name

                let songSearch = `${songArtist} - ${songName}`
                if (songSearch.includes('/')) {
                    songSearch = songSearch.replace('/', '')
                }

                const res = await getSong(songSearch).unwrap()
                const songInfoObject = {
                    index,
                    spotify_playlist: playlist,
                    spotify_song: song,
                    youtube_song: res,
                }
                dispatch(setSongInfo(songInfoObject))
            }

            // if track's from album
            if (playlist?.type === 'album') {
                const song = playlist?.tracks?.items[index]
                const songArtist = song?.artists[0]?.name
                const songName = song?.name

                let songSearch = `${songArtist} - ${songName}`
                if (songSearch.includes('/')) {
                    songSearch = songSearch.replace('/', '')
                }

                const res = await getSong(songSearch).unwrap()
                const songInfoObject = {
                    index,
                    spotify_playlist: playlist,
                    spotify_song: song,
                    youtube_song: res,
                }
                dispatch(setSongInfo(songInfoObject))
            }
        } catch (err) {
            console.log(err)
            if (err.data.message) {
                window.alert(err.data.message)
            }
        }
    }

    useEffect(() => {
        console.log(playlist)
    }, [playlist])

    return (
        <>
            <div
                style={{
                    maxHeight: '100%',
                    overflow: 'auto',
                }}
            >
                {/* navbar */}
                {(playlist?.type === 'playlist' ||
                    playlist?.type === 'album') && (
                    <div className="playlist-details-navbar">
                        {/* image */}
                        <img
                            src={
                                playlist?.images ? playlist?.images[0]?.url : ''
                            }
                            alt=""
                            className="playlist-details-img-box"
                        />

                        {/* details */}
                        <div className="playlist-details-info">
                            {/* name */}
                            <div
                                className={
                                    playlist?.name?.length > 26
                                        ? 'playlist-name-real-long'
                                        : playlist?.name?.length > 14
                                        ? 'playlist-name-long'
                                        : 'playlist-name'
                                }
                            >
                                {playlist?.name}
                            </div>

                            {/* description */}
                            {playlist?.description && (
                                <div className="playlist-description">
                                    {parse(`${playlist?.description}`)}
                                </div>
                            )}

                            {/* author, songs amount, followers amount */}
                            {/* owner if it's playlist */}
                            {playlist?.owner && (
                                <div className="playlist-author">
                                    <p
                                        onClick={() => {
                                            navTo(playlist?.owner?.id)
                                        }}
                                        style={{
                                            margin: '0px',
                                            marginRight: '4px',
                                        }}
                                    >
                                        {playlist?.owner.display_name}
                                    </p>
                                    {` - ${playlist?.tracks?.items?.length} songs`}
                                    {playlist?.followers?.total > 0
                                        ? ` - ${playlist?.followers?.total} likes`
                                        : ``}
                                </div>
                            )}

                            {/* artist / artists if it's album */}
                            {playlist?.artists && (
                                <div className="playlist-author">
                                    {playlist?.artists?.map((artist) => (
                                        <p
                                            key={artist?.name}
                                            onClick={() => {
                                                navigate(
                                                    `/artists/${artist?.id}`
                                                )
                                            }}
                                            className="artist-link"
                                        >
                                            {artist?.name}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* playlists songs */}
                <div className="table-box">
                    {/* table nav */}
                    <div className="table-nav">
                        <div className="column index">#</div>
                        <div className="column img-title-box">Title</div>
                        {playlist?.type === 'playlist' ? (
                            <div className="column album">Album</div>
                        ) : (
                            <div className="column album"></div>
                        )}
                        <div className="column time">Time</div>
                    </div>

                    {/* table items */}
                    {playlist?.tracks?.items?.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={
                                    songInfo?.spotify_song?.id ===
                                    (item?.id || item?.track?.id)
                                        ? `table-item-active`
                                        : `table-item`
                                }
                                onClick={() => {
                                    runPlayer(playlist, index)
                                }}
                            >
                                {/* id */}
                                <div className="column index">{index + 1}</div>

                                <div className="column img-title-box">
                                    {/* if playlist */}
                                    {playlist?.type === 'playlist' && (
                                        <img
                                            src={
                                                item?.track?.album?.images?.[2]
                                                    ?.url
                                            }
                                            className="title-img"
                                        />
                                    )}

                                    {/* if album */}
                                    {playlist?.type === 'album' && (
                                        <img
                                            src={playlist?.images?.[2]?.url}
                                            className="title-img"
                                        />
                                    )}

                                    {/* title */}
                                    <div className="column title">
                                        {/* if playlist */}
                                        {item?.track && (
                                            <>
                                                <h1>{item?.track?.name}</h1>
                                                <div className="album-artists-box">
                                                    {item?.track?.artists?.map(
                                                        (artist, index) => (
                                                            <h4 key={index}>
                                                                {index > 0
                                                                    ? `, ${artist?.name}`
                                                                    : artist?.name}
                                                            </h4>
                                                        )
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* if album */}
                                        {item?.name && (
                                            <>
                                                <h1>{item?.name}</h1>

                                                <div className="album-artists-box">
                                                    {item?.artists?.map(
                                                        (artist, index) => (
                                                            <h4 key={index}>
                                                                {index > 0
                                                                    ? `, ${artist?.name}`
                                                                    : artist?.name}
                                                            </h4>
                                                        )
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Album */}
                                {item?.track?.album ? (
                                    <div className="column album">
                                        {item?.track?.album?.name}
                                    </div>
                                ) : (
                                    <div className="column album"></div>
                                )}

                                {/* Time */}
                                {item?.track?.duration_ms &&
                                    convertTime(item?.track?.duration_ms)}

                                {item?.duration_ms &&
                                    convertTime(item?.duration_ms)}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default DetailsBox
