import { useSelector } from 'react-redux'
import { useGetAlbumIdMutation } from '../services/musicService'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import DetailsBox from '../components/detailsBox'
import Navbar from '../components/navbar'

const AlbumDetails = () => {
    const { authInfo } = useSelector((state) => state.auth)
    const [albumId] = useGetAlbumIdMutation()
    const params = useParams()
    const [album, setAlbum] = useState(null)

    const getAlbumId = useCallback(async () => {
        try {
            // get params id
            const { id } = params
            const res = await albumId({ authInfo, id }).unwrap()
            setAlbum(res)
        } catch (err) {
            console.log(err)
        }
    }, [albumId, params, authInfo, setAlbum])

    useEffect(() => {
        // fetch playlid by id
        getAlbumId()
    }, [getAlbumId])

    return (
        <>
            <div className="center-box">
                {/* navbar main */}
                <Navbar></Navbar>

                {/* album details */}
                {album && <DetailsBox playlist={album}></DetailsBox>}
            </div>
        </>
    )
}

export default AlbumDetails
