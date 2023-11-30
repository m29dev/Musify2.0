import { Outlet } from 'react-router-dom'
import './App.css'
import { useSelector } from 'react-redux'
import Leftbar from './components/leftbar'
import Rightbar from './components/rightbar'
import ControlPanel from './components/controlPanel'
import YoutubePlayer from './components/youtubePlayer'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const App = () => {
    const { authInfo } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (!authInfo) {
            console.log('no token => auth page')
            navigate('/auth')
        }
    }, [authInfo, navigate])

    return (
        <>
            <div className="main-box">
                <Leftbar />
                <div className="test-home-box">
                    <Outlet />

                    {/* youtube player */}
                    <YoutubePlayer></YoutubePlayer>

                    {/* control panel bar */}
                    <ControlPanel></ControlPanel>
                </div>
                <Rightbar />
            </div>
        </>
    )
}

export default App
