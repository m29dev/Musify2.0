import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useGetSongIdMutation } from '../services/musicService'
import { setHideLeftbar, setSongInfo } from '../redux/authSlice'
import {
    TbLayoutSidebarRightCollapseFilled,
    TbLayoutSidebarRightExpandFilled,
} from 'react-icons/tb'

const Leftbar = () => {
    const { songInfo, hideLeftbar, authInfo } = useSelector(
        (state) => state.auth
    )
    const [playlistDropdown, setPlaylistDropdown] = useState(true)
    const dispatch = useDispatch()

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

                const res = await getSong(
                    `${songArtist} - ${songName}`
                ).unwrap()
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

    return (
        <>
            {authInfo && (
                <div
                    className={
                        hideLeftbar ? 'bar-box leftbar-hide' : 'bar-box leftbar'
                    }
                >
                    {/* absolute toggle button */}
                    <div className="leftbar-navbar">
                        {/* show / hide bar button */}
                        <div
                            onClick={() =>
                                dispatch(setHideLeftbar(!hideLeftbar))
                            }
                        >
                            {/* on display true */}
                            {!hideLeftbar && (
                                <TbLayoutSidebarRightExpandFilled
                                    style={{ width: '30px', height: '30px' }}
                                ></TbLayoutSidebarRightExpandFilled>
                            )}

                            {/* on display false */}
                            {hideLeftbar && (
                                <TbLayoutSidebarRightCollapseFilled
                                    style={{ width: '30px', height: '30px' }}
                                ></TbLayoutSidebarRightCollapseFilled>
                            )}
                        </div>

                        {/* Brand name */}
                        {!hideLeftbar && (
                            <div className="leftbar-navbar-brand">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    fill="currentColor"
                                    className="bi bi-music-note-beamed"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"
                                    />
                                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
                                </svg>
                                <div>Musify</div>
                            </div>
                        )}
                    </div>

                    {songInfo && (
                        <>
                            <div
                                className="leftbar-playlist-box"
                                style={
                                    hideLeftbar ? { padding: '8px 0px' } : {}
                                }
                                onClick={() => {
                                    setPlaylistDropdown(!playlistDropdown)
                                }}
                            >
                                <img
                                    src={
                                        songInfo?.spotify_playlist?.images?.[2]
                                            ?.url ||
                                        songInfo?.spotify_playlist?.images?.[1]
                                            ?.url ||
                                        songInfo?.spotify_playlist?.images?.[0]
                                            ?.url
                                    }
                                    alt=""
                                    className="leftbar-playlist-img"
                                />

                                {!hideLeftbar && (
                                    <>
                                        <div className="leftbar-playlist-info">
                                            {songInfo?.spotify_playlist?.name}
                                        </div>

                                        <div style={{ flexGrow: 1 }}></div>

                                        {playlistDropdown && (
                                            <IoIosArrowDown></IoIosArrowDown>
                                        )}
                                        {!playlistDropdown && (
                                            <IoIosArrowUp></IoIosArrowUp>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* current playlist songs dropdown */}
                            {!hideLeftbar && (
                                <div className="leftbar-table-box">
                                    {playlistDropdown &&
                                        songInfo?.spotify_playlist?.tracks?.items?.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className={
                                                        songInfo?.spotify_song
                                                            ?.id ===
                                                        (item?.id ||
                                                            item?.track?.id)
                                                            ? `table-item-active leftbar-table-item`
                                                            : `table-item leftbar-table-item`
                                                    }
                                                    onClick={() => {
                                                        runPlayer(
                                                            songInfo?.spotify_playlist,
                                                            index
                                                        )
                                                    }}
                                                >
                                                    {/* song img */}
                                                    {/* if playlist */}
                                                    {songInfo?.spotify_playlist
                                                        ?.type ===
                                                        'playlist' && (
                                                        <img
                                                            src={
                                                                item?.track
                                                                    ?.album
                                                                    ?.images?.[2]
                                                                    ?.url
                                                            }
                                                            className="title-img"
                                                            style={{
                                                                height: '35px',
                                                                width: '35px',
                                                            }}
                                                        />
                                                    )}

                                                    {/* if album */}
                                                    {songInfo?.spotify_playlist
                                                        ?.type === 'album' && (
                                                        <img
                                                            src={
                                                                songInfo
                                                                    ?.spotify_playlist
                                                                    ?.images?.[2]
                                                                    ?.url
                                                            }
                                                            className="title-img"
                                                            style={{
                                                                height: '35px',
                                                                width: '35px',
                                                            }}
                                                        />
                                                    )}

                                                    <div className="column leftbar-title">
                                                        {item?.track && (
                                                            <>
                                                                <h1>
                                                                    {
                                                                        item
                                                                            ?.track
                                                                            ?.name
                                                                    }
                                                                </h1>

                                                                <div className="album-artists-box">
                                                                    {item?.track?.artists?.map(
                                                                        (
                                                                            artist,
                                                                            index
                                                                        ) => (
                                                                            <h4
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {index >
                                                                                0
                                                                                    ? `, ${artist?.name}`
                                                                                    : artist?.name}
                                                                            </h4>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {item?.name && (
                                                            <>
                                                                <h1>
                                                                    {item?.name}
                                                                </h1>

                                                                <div className="album-artists-box">
                                                                    {item?.artists?.map(
                                                                        (
                                                                            artist,
                                                                            index
                                                                        ) => (
                                                                            <h4
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {index >
                                                                                0
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
                                            )
                                        )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default Leftbar
