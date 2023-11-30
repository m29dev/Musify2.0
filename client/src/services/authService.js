import { apiSlice } from '../redux/apiSlice'

const AUTH_URL = '/auth'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/signin`,
                method: 'GET',
            }),
        }),
        refreshToken: builder.mutation({
            query: (authInfo) => ({
                url: `${AUTH_URL}/refresh/${authInfo.refresh_token}`,
                method: 'GET',
            }),
        }),

        auth: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}`,
                method: 'GET',
            }),
        }),
    }),
})

export const { useSignInMutation, useRefreshTokenMutation, useAuthMutation } =
    authApiSlice
