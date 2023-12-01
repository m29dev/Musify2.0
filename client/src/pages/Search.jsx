import Navbar from '../components/navbar'
import { Form } from 'react-bootstrap'
import { useCallback, useEffect, useState } from 'react'
import {
    useSearchQueryAdvanceMutation,
    useSearchQueryMutation,
} from '../services/musicService'
import { useDispatch, useSelector } from 'react-redux'
import SearchResultTracks from '../components/searchResultTracks'
import SearchResultArtists from '../components/searchResultArtists'
import SearchResultAlbums from '../components/searchResultAlbums'
import { useSearchParams } from 'react-router-dom'
import { clearAuthInfo } from '../redux/authSlice'
import Button from 'react-bootstrap/Button'

const Search = () => {
    const { authInfo } = useSelector((state) => state.auth)
    const [searchQuery, setSearchQuery] = useState('')
    const [getSearchQuery] = useSearchQueryMutation()

    const [tracks, setTracks] = useState(null)
    const [artists, setArtists] = useState(null)
    const [playlists, setPlaylists] = useState(null)
    const [albums, setAlbums] = useState(null)

    const [sortInfo, setSortInfo] = useState(null)

    const [searchParams, setSearchParams] = useSearchParams()
    const [queryType, setQueryType] = useState('text')

    // const navigate = useNavigate()
    const searchNavigate = (data) => {
        // navigate(`${data}`)

        //
        //
        const currParams = searchParams?.get('q')

        // check if already exists
        const currParamsS = searchParams?.get('s')
        if (currParamsS === data) {
            return setSearchParams(`?${new URLSearchParams({ q: currParams })}`)
        }

        setSearchParams(`?${new URLSearchParams({ q: currParams, s: data })}`)
    }

    const [page, setPage] = useState(1)
    const changePage = (int) => {
        if (page + int <= 0) return console.log('cannot go to page 0')
        if (page + int >= 20) return console.log('cannot go to page over 20')
        setPage(page + int)
        console.log('CURRENT PAGE: ', page + int)
    }

    const dispatch = useDispatch()
    const getSearchResults = useCallback(
        async (query) => {
            try {
                console.log('on search, PAGE: ', page)

                // GET SEARCH RESULTS
                const res = await getSearchQuery({
                    access_token: authInfo?.access_token,
                    query,
                    page: JSON.stringify(page),
                }).unwrap()

                console.log(res)
                if (
                    res?.error?.status === 401 &&
                    res?.error?.message === 'The access token expired'
                ) {
                    dispatch(clearAuthInfo())
                }

                if (!sortInfo) {
                    const searchResultTracks = []
                    const searchResultArtists = []
                    const searchResultPlaylists = []
                    const searchResultAlbums = []

                    // get first 5 items
                    for (let i = 0; i <= 4; i++) {
                        searchResultTracks.push(res?.tracks?.items?.[i])
                        searchResultArtists.push(res?.artists?.items?.[i])
                        searchResultPlaylists.push(res?.playlists?.items?.[i])
                        searchResultAlbums.push(res?.albums?.items?.[i])
                    }

                    setTracks(searchResultTracks)
                    setArtists(searchResultArtists)
                    setPlaylists(searchResultPlaylists)
                    setAlbums(searchResultAlbums)
                }

                if (sortInfo) {
                    setTracks(res?.tracks?.items)
                    setArtists(res?.artists?.items)
                    setPlaylists(res?.playlists?.items)
                    setAlbums(res?.albums?.items)
                }
            } catch (err) {
                console.log(err)
            }
        },
        [
            sortInfo,
            getSearchQuery,
            authInfo,
            setTracks,
            setArtists,
            setPlaylists,
            setAlbums,
            dispatch,
            page,
        ]
    )

    const onSearchQuery = async (query) => {
        try {
            if (query === ('' || null)) {
                setTracks(null),
                    setArtists(null),
                    setPlaylists(null),
                    setAlbums(null)
            }

            // SET SEARCH QUERIES IN THE URL
            setSearchParams(`?${new URLSearchParams({ q: query })}`)

            const currParams = searchParams?.get('s')
            setSearchParams(
                `?${new URLSearchParams({ q: query, s: currParams })}`
            )
        } catch (err) {
            console.log(err)
        }
    }

    const [getSearchAdvance] = useSearchQueryAdvanceMutation()
    const searchAdvance = async (data) => {
        try {
            if (data === ('' || null)) {
                setTracks(null),
                    setArtists(null),
                    setPlaylists(null),
                    setAlbums(null)
            }

            const dataText = data
            let id

            if (dataText?.slice(0, 8) === 'https://') {
                if (dataText.slice(25, 27) === 'pl') id = dataText.slice(34)
                if (dataText.slice(25, 27) === 'al') id = dataText.slice(31)
                if (dataText.slice(25, 27) === 'ar') id = dataText.slice(32)
                if (dataText.slice(25, 27) === 'tr') id = dataText.slice(31)
            } else {
                id = dataText
            }

            console.log(956, id)
            const res = await getSearchAdvance({
                access_token: authInfo.access_token,
                query: id,
            }).unwrap()

            if (
                res?.error?.status === 401 &&
                res?.error?.message === 'The access token expired'
            ) {
                dispatch(clearAuthInfo())
            }

            if (res?.type === 'track') setTracks([res])
            if (res?.type === 'artist') setArtists([res])
            if (res?.type === 'playlist') setPlaylists([res])
            if (res?.type === 'album') setAlbums([res])
        } catch (err) {
            console.log(err)
        }
    }

    // const searchLink = (data) => {
    //     console.log(data)
    // }

    // const searchID = (data) => {
    //     console.log(data)
    // }

    // on searchParams update GET SEARCH RESULTS
    useEffect(() => {
        // check for query
        if (searchParams?.get('q') !== ('' || null)) {
            getSearchResults(searchParams?.get('q'))
        }

        // check for sort
        if (searchParams?.get('s') === ('' || null)) {
            setSortInfo(null)
            console.log('test: ', searchParams?.get('s'))
        } else {
            setSortInfo(searchParams?.get('s'))
        }

        if (searchParams?.get('s') === 'null') {
            setSortInfo(null)
            console.log('test: ', searchParams?.get('s'))
        }
    }, [searchParams, getSearchResults, setSearchParams])

    // on init set search value same as in searchParams if exists
    useEffect(() => {
        if (searchParams?.get('q')) {
            setSearchQuery(searchParams?.get('q'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const changeQueryType = (e) => {
        setTracks(null)
        setArtists(null)
        setPlaylists(null)
        setAlbums(null)

        setQueryType(e)
    }

    return (
        <div className="center-box">
            {/* navbar main */}
            <Navbar></Navbar>

            <div>
                <Button
                    variant="dark"
                    className="btn-search"
                    disabled={queryType === 'text' ? true : false}
                    onClick={() => {
                        changeQueryType('text')
                    }}
                >
                    Text
                </Button>

                <Button
                    variant="dark"
                    className="btn-search"
                    disabled={queryType === 'id' ? true : false}
                    onClick={() => {
                        changeQueryType('id')
                    }}
                >
                    Link
                </Button>
            </div>

            {/* search nav */}
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                }}
            >
                {queryType === 'text' && (
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        className="form-control"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            onSearchQuery(e.target.value)
                        }}
                    />
                )}

                {queryType === 'id' && (
                    <Form.Control
                        type="text"
                        placeholder="Search by ID / Link"
                        className="form-control"
                        onChange={(e) => {
                            searchAdvance(e.target.value)
                        }}
                    />
                )}
            </Form>

            <div
                style={{
                    paddingTop: '23px',
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    variant="dark"
                    className="btn-search-sort"
                    onClick={() => {
                        searchNavigate('songs')
                    }}
                >
                    Songs
                </Button>

                <Button
                    variant="dark"
                    className="btn-search-sort"
                    onClick={() => {
                        searchNavigate('albums')
                    }}
                >
                    Albums
                </Button>

                <Button
                    variant="dark"
                    className="btn-search-sort"
                    onClick={() => {
                        searchNavigate('artists')
                    }}
                >
                    Artists
                </Button>

                <Button
                    variant="dark"
                    className="btn-search-sort"
                    onClick={() => {
                        searchNavigate('playlists')
                    }}
                >
                    Playlists
                </Button>
            </div>

            {/* Search results box */}
            {!sortInfo && (
                <div className="search-results-box">
                    {/* Tracks results */}
                    {tracks && (
                        <>
                            <h3
                                style={{ margin: '0px' }}
                                onClick={() => {
                                    searchNavigate('songs')
                                }}
                            >
                                Songs
                            </h3>
                            <SearchResultTracks
                                tracksData={tracks}
                            ></SearchResultTracks>
                        </>
                    )}

                    {/* Artists results */}
                    {artists && (
                        <>
                            <h3
                                onClick={() => {
                                    searchNavigate('artists')
                                }}
                            >
                                Artists
                            </h3>
                            <SearchResultArtists
                                artists={artists}
                            ></SearchResultArtists>
                        </>
                    )}

                    {/* Albums results */}
                    {albums && (
                        <>
                            <h3
                                onClick={() => {
                                    searchNavigate('albums')
                                }}
                            >
                                Albums
                            </h3>
                            <SearchResultAlbums
                                albums={albums}
                            ></SearchResultAlbums>
                        </>
                    )}

                    {/* Playlists results */}
                    {playlists && (
                        <>
                            <h3
                                onClick={() => {
                                    searchNavigate('playlists')
                                }}
                            >
                                Playlists
                            </h3>
                            <SearchResultAlbums
                                albums={playlists}
                            ></SearchResultAlbums>
                        </>
                    )}
                </div>
            )}

            {/* sort tracks */}
            {sortInfo === 'songs' && (
                <div className="search-results-box">
                    {/* Tracks results */}
                    {tracks && (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <h3
                                    style={{ margin: '0px' }}
                                    onClick={() => {
                                        searchNavigate('songs')
                                    }}
                                >
                                    Songs
                                </h3>

                                <div style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => {
                                            changePage(-1)
                                        }}
                                    >
                                        PREV{' '}
                                    </div>
                                    <h3
                                        style={{
                                            margin: '0px',
                                            marginLeft: '4px',
                                            marginRight: '4px',
                                        }}
                                    >
                                        {page}
                                    </h3>
                                    <div
                                        onClick={() => {
                                            changePage(1)
                                        }}
                                    >
                                        {' '}
                                        NEXT
                                    </div>
                                </div>
                            </div>

                            <SearchResultTracks
                                tracksData={tracks}
                            ></SearchResultTracks>
                        </>
                    )}
                </div>
            )}

            {/* sort albums */}
            {sortInfo === 'albums' && (
                <div className="search-results-box">
                    {/* Albums results */}
                    {albums && (
                        <>
                            {/* <h3
                                onClick={() => {
                                    searchNavigate('albums')
                                }}
                            >
                                Albums
                            </h3> */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <h3
                                    style={{ margin: '0px' }}
                                    onClick={() => {
                                        searchNavigate('albums')
                                    }}
                                >
                                    Albums
                                </h3>

                                <div style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => {
                                            changePage(-1)
                                        }}
                                    >
                                        PREV{' '}
                                    </div>
                                    <h3
                                        style={{
                                            margin: '0px',
                                            marginLeft: '4px',
                                            marginRight: '4px',
                                        }}
                                    >
                                        {page}
                                    </h3>
                                    <div
                                        onClick={() => {
                                            changePage(1)
                                        }}
                                    >
                                        {' '}
                                        NEXT
                                    </div>
                                </div>
                            </div>

                            <SearchResultAlbums
                                albums={albums}
                            ></SearchResultAlbums>
                        </>
                    )}
                </div>
            )}

            {/* sort artists */}
            {sortInfo === 'artists' && (
                <div className="search-results-box">
                    {/* Artists results */}
                    {artists && (
                        <>
                            {/* <h3
                                onClick={() => {
                                    searchNavigate('artists')
                                }}
                            >
                                Artists
                            </h3> */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <h3
                                    style={{ margin: '0px' }}
                                    onClick={() => {
                                        searchNavigate('artists')
                                    }}
                                >
                                    Artists
                                </h3>

                                <div style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => {
                                            changePage(-1)
                                        }}
                                    >
                                        PREV{' '}
                                    </div>
                                    <h3
                                        style={{
                                            margin: '0px',
                                            marginLeft: '4px',
                                            marginRight: '4px',
                                        }}
                                    >
                                        {page}
                                    </h3>
                                    <div
                                        onClick={() => {
                                            changePage(1)
                                        }}
                                    >
                                        {' '}
                                        NEXT
                                    </div>
                                </div>
                            </div>

                            <SearchResultArtists
                                artists={artists}
                            ></SearchResultArtists>
                        </>
                    )}
                </div>
            )}

            {sortInfo === 'playlists' && (
                <div className="search-results-box">
                    {/* Playlists results */}
                    {playlists && (
                        <>
                            {/* <h3
                                onClick={() => {
                                    searchNavigate('playlists')
                                }}
                            >
                                Playlists
                            </h3> */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <h3
                                    style={{ margin: '0px' }}
                                    onClick={() => {
                                        searchNavigate('playlists')
                                    }}
                                >
                                    Playlists
                                </h3>

                                <div style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => {
                                            changePage(-1)
                                        }}
                                    >
                                        PREV{' '}
                                    </div>
                                    <h3
                                        style={{
                                            margin: '0px',
                                            marginLeft: '4px',
                                            marginRight: '4px',
                                        }}
                                    >
                                        {page}
                                    </h3>
                                    <div
                                        onClick={() => {
                                            changePage(1)
                                        }}
                                    >
                                        {' '}
                                        NEXT
                                    </div>
                                </div>
                            </div>

                            <SearchResultAlbums
                                albums={playlists}
                            ></SearchResultAlbums>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Search
