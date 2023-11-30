import { Container } from 'react-bootstrap'
import Navbar from '../components/navbar'
import { useCallback, useEffect } from 'react'
import { useGetArtistsSavedMutation } from '../services/musicService'
import { useSelector } from 'react-redux'

const Artists = () => {
    const { authInfo } = useSelector((state) => state.auth)
    const [artistsSaved] = useGetArtistsSavedMutation()

    const getArtistsSaved = useCallback(async () => {
        try {
            const res = await artistsSaved(authInfo?.access_token).unwrap()
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }, [artistsSaved, authInfo])

    useEffect(() => {
        getArtistsSaved()
    }, [getArtistsSaved])

    return (
        <>
            <div className="center-box">
                {/* navbar main */}
                <Navbar></Navbar>

                <Container fluid className="home-box">
                    {/* {playlists?.map((playlist) => {
                        return (
                            <div key={playlist?.name} className="home-box-item">
                                <CardComponent
                                    playlist={playlist}
                                ></CardComponent>
                            </div>
                        )
                    })} */}
                </Container>
            </div>
        </>
    )
}

export default Artists
