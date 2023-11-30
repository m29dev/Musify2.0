import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SearchResultAlbums = (albums) => {
    const navigate = useNavigate()

    const onAlbumClick = (album) => {
        if (album?.type === 'album') navigate(`/albums/${album?.id}`)
        if (album?.type === 'playlist') navigate(`/playlists/${album?.id}`)
    }

    return (
        <>
            <div className="search-results-grid">
                {albums?.albums?.map((album, index) => (
                    <Card
                        key={index}
                        className="card-item"
                        onClick={() => {
                            onAlbumClick(album)
                        }}
                    >
                        <Card.Img
                            variant="top"
                            src={
                                album?.images?.[1]
                                    ? album?.images?.[1]?.url
                                    : album?.images?.[0]?.url
                            }
                            className="card-img-box img-albums"
                        />
                        <Card.Body>
                            <Card.Title>{album?.name}</Card.Title>

                            <div className="album-artists-box">
                                {/* display artists if it's an album */}
                                {album?.artists?.map((artist, index) =>
                                    index > 0
                                        ? `, ${artist?.name}`
                                        : artist?.name
                                )}

                                {/* display owner if it's a playlist */}
                                {album?.owner &&
                                    `By ` + album?.owner?.display_name}
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default SearchResultAlbums
