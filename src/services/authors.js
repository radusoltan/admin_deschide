import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({url, headers})

export const authors = createApi({
  reducerPath: 'authors',
  baseQuery: fetchBaseQuery({baseUrl}),
  tagTypes: ['Authors'],
  endpoints: build => ({
    getArticleAuthors: build.query({
      query: article => createRequest(`/article/${article}/authors`),
      providesTags: r => console.log('get auth',r)
    }),
    searchAuthor: build.mutation({
      query: (body) => ({
        url: baseUrl + `/authors/search`,
        method: "POST",
        body,
        headers
      }),
      invalidatesTags: (result, error, obj) => console.log(' API inv obj', result)
    }),
    addArticleAuthors: build.mutation({
      query: ({article, body})=>({
        url: baseUrl + `/article/${article}/authors`,
        method: 'POST',
        body,
        headers
      })
    })
  })
})

export const {
  useGetArticleAuthorsQuery,
  useSearchAuthorMutation,
  useAddArticleAuthorsMutation
} = authors