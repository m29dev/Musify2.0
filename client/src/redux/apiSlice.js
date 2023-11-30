import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    // baseUrl: 'https://musifyserver.onrender.com/api',
    baseUrl: 'http://localhost:3000/api',
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Auth'],
    endpoints: () => ({}),
})
