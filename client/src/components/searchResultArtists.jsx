import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SearchResultArtists = (artists) => {
    const navigate = useNavigate()

    const onArtistClick = (artistInfo) => {
        navigate(`/artists/${artistInfo?.id}`)
    }

    return (
        <>
            <div className="search-results-grid">
                {artists?.artists?.map((artist, index) => (
                    <Card
                        key={index}
                        className="card-item"
                        onClick={() => {
                            onArtistClick(artist)
                        }}
                    >
                        <Card.Img
                            variant="top"
                            src={artist?.images?.[0]?.url}
                            className="card-img-box img-artists"
                        />
                        <Card.Body>
                            <Card.Title>{artist?.name}</Card.Title>
                            <h4 className="album-artists-box">Artist</h4>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default SearchResultArtists
