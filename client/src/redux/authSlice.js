import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    authInfo: localStorage.getItem('authInfo')
        ? JSON.parse(localStorage.getItem('authInfo'))
        : null,

    accountInfo: localStorage.getItem('accountInfo')
        ? JSON.parse(localStorage.getItem('accountInfo'))
        : null,

    // spotify_playlist
    // spotify_song
    // youtube_song
    songInfo: localStorage.getItem('songInfo')
        ? JSON.parse(localStorage.getItem('songInfo'))
        : null,

    controlPanelInfo: {
        playVideo: true,
        durationVideo: 0,
        volumeVideo: 0.5,
    },

    onChangeDuration: {
        durationVideo: 0,
    },

    fullScreenMode: false,
    hideLeftbar: false,
    hideRightbar: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // authorization information
        setAuthInfo: (state, action) => {
            state.authInfo = action.payload
            localStorage.setItem('authInfo', JSON.stringify(action.payload))
        },
        updateAuthInfoToken: (state, action) => {
            state.authInfo.access_token = action.payload.access_token
            localStorage.setItem('authInfo', JSON.stringify(state.authInfo))
        },
        clearAuthInfo: (state) => {
            state.authInfo = null
            localStorage.removeItem('authInfo')
        },

        // account information
        setAccountInfo: (state, action) => {
            state.accountInfo = action.payload
            localStorage.setItem('accountInfo', JSON.stringify(action.payload))
        },
        clearAccountInfo: (state) => {
            state.accountInfo = null
            localStorage.removeItem('accountInfo')
        },

        // song information
        setSongInfo: (state, action) => {
            state.songInfo = action.payload
            localStorage.setItem('songInfo', JSON.stringify(action.payload))
        },
        clearSongInfo: (state) => {
            state.songInfo = null
            localStorage.removeItem('songInfo')
        },

        // control panel
        setPlayVideo: (state, action) => {
            state.controlPanelInfo.playVideo = action.payload
        },
        setDurationVideo: (state, action) => {
            state.controlPanelInfo.durationVideo = action.payload
        },
        setVolumeVideo: (state, action) => {
            state.controlPanelInfo.volumeVideo = action.payload
        },
        setOnChangeDuration: (state, action) => {
            state.onChangeDuration.durationVideo = action.payload
        },
        clearControlPanelInfo: (state) => {
            state.controlPanelInfo = null
        },

        // fullscreen
        setFullScreenMode: (state, action) => {
            state.fullScreenMode = action.payload
        },

        // sidebars
        setHideLeftbar: (state, action) => {
            state.hideLeftbar = action.payload
        },
        setHideRightbar: (state, action) => {
            state.hideRightbar = action.payload
        },
    },
})

export const {
    setAuthInfo,
    updateAuthInfoToken,
    clearAuthInfo,
    setAccountInfo,
    clearAccountInfo,
    setSongInfo,
    clearSongInfo,
    setPlayVideo,
    setDurationVideo,
    setVolumeVideo,
    setOnChangeDuration,
    clearControlPanelInfo,
    setFullScreenMode,
    setHideLeftbar,
    setHideRightbar,
} = authSlice.actions
export default authSlice.reducer
