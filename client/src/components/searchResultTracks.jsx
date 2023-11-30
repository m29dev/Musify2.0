import { useDispatch } from 'react-redux'
import { useGetSongIdMutation } from '../services/musicService'
import { setSongInfo } from '../redux/authSlice'

const SearchResultTracks = (tracks) => {
    const dispatch = useDispatch()

    const [getSong] = useGetSongIdMutation()
    const runPlayer = async (track, index) => {
        try {
            const songArtist = track?.artists?.[0]?.name
            const songName = track?.name

            const res = await getSong(`${songArtist} - ${songName}`).unwrap()

            const songInfoObject = {
                index,
                spotify_playlist: {
                    tracks: { items: tracks?.tracksData },
                    type: `album`,
                    name: `${songArtist} - Radio`,
                    images: track?.album?.images,
                },
                spotify_song: track,
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

    return (
        <>
            <div className="search-results-tracks">
                {tracks?.tracksData?.map((track, index) => (
                    <div
                        key={index}
                        className="table-item"
                        onClick={() => {
                            runPlayer(track, index)
                        }}
                    >
                        {/* image */}
                        <img
                            src={track?.album?.images?.[2]?.url}
                            style={{
                                height: '40px',
                                width: '40px',
                            }}
                        />

                        {/* title */}
                        <div
                            className="column title"
                            style={{
                                width: '100%',
                                marginLeft: '12px',
                            }}
                        >
                            {track?.name && (
                                <>
                                    <h1>{track?.name}</h1>

                                    <div className="album-artists-box">
                                        {track?.artists?.map(
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

                        {/* duration */}
                    </div>
                ))}
            </div>
        </>
    )
}

export default SearchResultTracks
