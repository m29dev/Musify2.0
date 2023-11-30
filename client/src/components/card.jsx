import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import parse from 'html-react-parser'

function CardComponent(playlist) {
    const playlistInfo = playlist
    const navigate = useNavigate()

    const navTo = () => {
        const type = playlistInfo?.playlist?.type
        const id = playlistInfo.playlist.id
        navigate(`/${type}s/${id}`)
    }

    return (
        <Card className="card-item" onClick={navTo}>
            <Card.Img
                variant="top"
                src={playlistInfo?.playlist?.images[0]?.url}
                className="card-img-box"
            />
            <Card.Body>
                <Card.Title>{playlistInfo?.playlist?.name}</Card.Title>

                {playlistInfo?.playlist?.description && (
                    <Card.Text>
                        {parse(`${playlistInfo?.playlist?.description}`)}
                    </Card.Text>
                )}

                {playlistInfo?.playlist?.artists && (
                    <div>
                        {playlistInfo?.playlist?.artists.map((artist, index) =>
                            // <p key={artist?.name}>{artist?.name}</p>
                            index > 0 ? `, ${artist?.name}` : `${artist?.name}`
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default CardComponent
