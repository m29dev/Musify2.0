import { useCallback, useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { useGetArtistIdMutation } from '../services/musicService'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SearchResultTracks from '../components/searchResultTracks'
import SearchResultAlbums from '../components/searchResultAlbums'

const ArtistDetails = () => {
    const { authInfo } = useSelector((state) => state.auth)
    const params = useParams()
    const [aristId] = useGetArtistIdMutation()

    const [artist, setArtist] = useState(null)

    const getArtistId = useCallback(async () => {
        try {
            const id = params.id
            const res = await aristId({ authInfo, id }).unwrap()
            setArtist(res)
        } catch (err) {
            console.log(err)
        }
    }, [aristId, authInfo, params, setArtist])

    useEffect(() => {
        getArtistId()
    }, [getArtistId])

    return (
        <>
            <div className="center-box">
                {/* navbar main */}
                <Navbar></Navbar>

                {/* artist navbar */}
                {/* navbar */}
                {artist && (
                    <>
                        <div className="playlist-details-navbar">
                            {/* image */}
                            <img
                                src={
                                    artist?.images ? artist?.images[0]?.url : ''
                                }
                                alt=""
                                className="playlist-details-img-box"
                            />

                            {/* details */}
                            <div className="playlist-details-info">
                                {/* name */}
                                <div
                                    className={
                                        artist?.name?.length > 26
                                            ? 'playlist-name-real-long'
                                            : artist?.name?.length > 14
                                            ? 'playlist-name-long'
                                            : 'playlist-name'
                                    }
                                >
                                    {artist?.name}
                                </div>
                            </div>
                        </div>

                        {/* Artist info */}
                        {/* Search results box */}
                        <div className="search-results-box">
                            {/* Tracks results */}
                            {artist?.tracks && (
                                <>
                                    <h3 style={{ margin: '0px' }}>Songs</h3>
                                    <SearchResultTracks
                                        tracksData={artist?.tracks}
                                    ></SearchResultTracks>
                                </>
                            )}

                            {/* Albums results */}
                            {artist?.albums && (
                                <>
                                    <h3>Albums</h3>
                                    <SearchResultAlbums
                                        albums={artist?.albums}
                                    ></SearchResultAlbums>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default ArtistDetails
