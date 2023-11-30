import Navbar from '../components/navbar'
import { useGetPlaylistIdMutation } from '../services/musicService'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailsBox from '../components/detailsBox'

const PlaylistDetails = () => {
    const [playlistId] = useGetPlaylistIdMutation()
    const params = useParams()
    const { authInfo, hideLeftbar, hideRightbar } = useSelector(
        (state) => state.auth
    )
    const [playlist, setPlaylist] = useState(null)

    const getPlaylistId = useCallback(async () => {
        try {
            // get params id
            const { id } = params
            const res = await playlistId({ authInfo, id }).unwrap()
            setPlaylist(res)
        } catch (err) {
            console.log(err)
        }
    }, [playlistId, params, authInfo, setPlaylist])

    useEffect(() => {
        // fetch playlid by id
        getPlaylistId()
    }, [getPlaylistId])

    const [maxWidth, setMaxWidth] = useState(false)
    useEffect(() => {
        if (window.innerWidth > 1500 && !hideLeftbar && !hideRightbar) {
            setMaxWidth(true)
        } else {
            setMaxWidth(false)
        }
    }, [hideLeftbar, hideRightbar, setMaxWidth])

    return (
        <div
            className="center-box"
            style={maxWidth ? { maxWidth: '1004px' } : {}}
        >
            {/* navbar main */}
            <Navbar></Navbar>
            {playlist && <DetailsBox playlist={playlist}></DetailsBox>}
        </div>
    )
}

export default PlaylistDetails
