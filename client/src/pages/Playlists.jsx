import { useCallback, useEffect, useState } from 'react'
import { useGetAllPlaylistsMutation } from '../services/musicService'
import { useSelector } from 'react-redux'
import CardComponent from '../components/card'
import Navbar from '../components/navbar'
import { Container } from 'react-bootstrap'

const Playlists = () => {
    const { authInfo, hideLeftbar, hideRightbar } = useSelector(
        (state) => state.auth
    )
    const [allPlaylists] = useGetAllPlaylistsMutation()
    const [playlists, setPlaylists] = useState(null)

    const getAllPlaylists = useCallback(async () => {
        try {
            const res = await allPlaylists(authInfo).unwrap()
            setPlaylists(res.items)
        } catch (err) {
            console.log(err)
        }
    }, [allPlaylists, authInfo])

    useEffect(() => {
        getAllPlaylists()
    }, [getAllPlaylists])

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
                    {playlists?.map((playlist) => {
                        return (
                            <div key={playlist?.name} className="home-box-item">
                                <CardComponent
                                    playlist={playlist}
                                ></CardComponent>
                            </div>
                        )
                    })}
                </Container>
            </div>
        </>
    )
}

export default Playlists
