import { apiSlice } from '../redux/apiSlice'

const MUSIC_URL = '/music'

export const musicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // playlists
        getAllPlaylists: builder.mutation({
            query: (authInfo) => ({
                url: `${MUSIC_URL}/playlists/${authInfo.access_token}`,
                method: 'GET',
            }),
        }),
        getPlaylistId: builder.mutation({
            query: (data) => ({
                url: `${MUSIC_URL}/playlists/${data.authInfo.access_token}`,
                method: 'POST',
                body: { id: data.id },
            }),
        }),

        // albums
        getAllAlbums: builder.mutation({
            query: (authInfo) => ({
                url: `${MUSIC_URL}/albums/${authInfo.access_token}`,
                method: 'GET',
            }),
        }),
        getAlbumId: builder.mutation({
            query: (data) => ({
                url: `${MUSIC_URL}/albums/${data.authInfo.access_token}`,
                method: 'POST',
                body: { id: data.id },
            }),
        }),

        // songs youtube
        getSongId: builder.mutation({
            query: (query) => ({
                url: `${MUSIC_URL}/youtube/${query}`,
                method: 'GET',
            }),
        }),

        // saved fav songs spotify
        getSongsSaved: builder.mutation({
            query: (access_token) => ({
                url: `${MUSIC_URL}/songs/saved/${access_token}`,
                method: 'GET',
            }),
        }),

        // search songs / artists / albums / playlists
        searchQuery: builder.mutation({
            query: (data) => ({
                url: `${MUSIC_URL}/search/${data.access_token}/${data.query}/${data.page}`,
                method: 'GET',
            }),
        }),

        searchQueryPost: builder.mutation({
            query: (data) => ({
                url: `${MUSIC_URL}/search`,
                method: 'POST',
                body: data,
            }),
        }),

        searchQueryAdvance: builder.mutation({
            query: (data) => ({
                url: `${MUSIC_URL}/search/advance/${data.access_token}/${data.query}`,
                method: 'GET',
            }),
        }),

        // artists saved
        getArtistsSaved: builder.mutation({
            query: (access_token) => ({
                url: `${MUSIC_URL}/artists/saved/${access_token}`,
                method: 'GET',
            }),
        }),
        getArtistId: builder.mutation({
            query: (data) => ({
                url: `${MUSIC_URL}/artists/${data.authInfo.access_token}`,
                method: 'POST',
                body: { id: data.id },
            }),
        }),

        // user's top songs
        getSongsTop: builder.mutation({
            query: (access_token) => ({
                url: `${MUSIC_URL}/songs/top/${access_token}`,
                method: 'GET',
            }),
        }),

        getSongInit: builder.mutation({
            query: (access_token) => ({
                url: `${MUSIC_URL}/songs/init/${access_token}`,
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGetAllPlaylistsMutation,
    useGetPlaylistIdMutation,
    useGetAllAlbumsMutation,
    useGetAlbumIdMutation,
    useGetSongIdMutation,
    useGetSongsSavedMutation,
    useSearchQueryMutation,
    useSearchQueryPostMutation,
    useSearchQueryAdvanceMutation,
    useGetArtistsSavedMutation,
    useGetArtistIdMutation,
    useGetSongsTopMutation,
    useGetSongInitMutation,
} = musicApiSlice
