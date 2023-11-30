import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

const ErrorPage = () => {
    const navigate = useNavigate()

    return (
        <div
            className="center-box"
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* navbar main */}
            <Navbar></Navbar>

            <div>
                <h1>Page not found</h1>
                <h4
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        navigate(`/home`)
                    }}
                >
                    Go back to home page
                </h4>
            </div>
        </div>
    )
}

export default ErrorPage
