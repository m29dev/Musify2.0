import { useSelector } from 'react-redux'
import { useGetAllAlbumsMutation } from '../services/musicService'
import { useCallback, useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { Container } from 'react-bootstrap'
import CardComponent from '../components/card'

const Albums = () => {
    const { authInfo, hideLeftbar, hideRightbar } = useSelector(
        (state) => state.auth
    )
    const [getAlbums] = useGetAllAlbumsMutation()
    const [albums, setAlbums] = useState(null)

    const getAlbumsData = useCallback(async () => {
        try {
            const res = await getAlbums(authInfo).unwrap()
            setAlbums(res)
        } catch (err) {
            console.log(err)
        }
    }, [getAlbums, authInfo, setAlbums])

    useEffect(() => {
        getAlbumsData()
    }, [getAlbumsData])

    const [classVar, setClassVar] = useState('')
    useEffect(() => {
        if (!hideLeftbar && !hideRightbar)
            setClassVar('home-box home-box-classic')
        if (hideLeftbar && !hideRightbar) setClassVar('home-box home-box-wide')
        if (!hideLeftbar && hideRightbar) setClassVar('home-box home-box-wide')
        if (hideLeftbar && hideRightbar)
            setClassVar('home-box home-box-very-wide')
    }, [hideLeftbar, hideRightbar, setClassVar])

    return (
        <>
            <div className="center-box">
                {/* navbar main */}
                <Navbar></Navbar>

                <Container fluid className={classVar}>
                    {albums?.items?.map((album) => {
                        return (
                            <div
                                key={album?.album?.name}
                                className="home-box-item"
                            >
                                <CardComponent
                                    playlist={album?.album}
                                ></CardComponent>
                            </div>
                        )
                    })}
                </Container>
            </div>
        </>
    )
}

export default Albums
