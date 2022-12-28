import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import i18n from "./../i18n"

const baseUrl = process.env.REACT_APP_API_URL

// Define a service using a base URL and expected endpoints
export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (page) => `/categories?locale=${i18n.language}?page=${page}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCategoriesQuery
} = categoryApi