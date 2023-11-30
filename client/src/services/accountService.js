import { apiSlice } from '../redux/apiSlice'

const ACCOUNT_URL = '/account'

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccount: builder.mutation({
            query: (data) => ({
                url: `${ACCOUNT_URL}/${data?.access_token}`,
                method: 'GET',
            }),
        }),
    }),
})

export const { useGetAccountMutation } = accountApiSlice
