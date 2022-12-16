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
      providesTags: r => r ? [
        ...r.map(({id})=>({type:'Authors',id})),
        {type:'Authors',id:'LIST'}
      ] : [{ type: 'Authors', id: 'LIST' }],
    }),
    addArticleAuthors: build.mutation({
      query: ({article, body})=>({
        url: baseUrl + `/article/${article}/authors`,
        method: 'POST',
        body,
        headers
      }),
      invalidatesTags: result => result ? [
        ...result.map(({id})=>({type:'Authors',id})),
        {type:'Authors',id:'LIST'}
      ] : [{ type: 'Authors', id: 'LIST' }],
    }),
    getAllAuthors: build.query({
      query: ()=>createRequest('/authors'),
      providesTags: r => r ? [
        ...r.map(({ id }) => ({ type: "Authors", id })),
        {type: "Authors", id: "LIST"}
      ] : [{type: "Authors", id: "LIST"}]
    }),
    addAuthor: build.mutation({
      query: (body)=>({
        url: baseUrl + `/authors`,
        method: 'POST',
        body,
      }),
      invalidatesTags: result => result ? [
        ...result.map(({id})=>({type:'Authors',id})),
        {type:'Authors',id:'LIST'}
      ] : [{ type: 'Authors', id: 'LIST' }],
    }),
    deleteArticleAuthor: build.mutation({
      query: ({article, authorId}) => ({
        url: baseUrl + `/article/${article}/authors/${authorId}`,
        method: 'DELETE',
        headers
      }),
      invalidatesTags: (result, error, id) => result ? [
        ...result.map(({id})=>({type:'Authors',id})),
        {type:'Authors',id:'LIST'}
      ] : [{ type: 'Authors', id: 'LIST' }],
    })

  })
})

export const {
  useGetArticleAuthorsQuery,
  useAddArticleAuthorsMutation,
  useGetAllAuthorsQuery,
  useAddAuthorMutation,
  useDeleteArticleAuthorMutation
} = authors