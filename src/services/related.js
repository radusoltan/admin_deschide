import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const related = createApi({
  reducerPath: 'related',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Related'],
  endpoints: build => ({
    getRelatedArticles: build.query({
      query: (article) => createRequest(`/article/${article}/related`),
      providesTags: r => r ? [
        ...r.map(({ id }) => ({ type: 'Related', id })),
        { type: 'Related', id: 'LIST' }
      ] : [{ type: 'Related', id: 'LIST' }]
    }),
    addRelatedArticles: build.mutation({
      query: ({ article, body }) => ({
        url: `/article/${article}/related-add`,
        method: "POST",
        body,
        headers
      }),
      invalidatesTags: r => r ?
        [
          ...r.map(i => ({ type: 'Related', id: i })),
          { type: "Related", id: "LIST" }
        ] : [{ type: 'Related', id: 'LIST' }]
    }),
    detachRelatedArticle: build.mutation({
      query: ({article, body}) => ({
        url: `/article/${article}/related-detach`,
        method: 'POST',
        body,
        headers
      }),
      invalidatesTags: r => r ? [
        ...r.map(({id})=>({type:'Related',id})),
        { type: 'Related', id: 'LIST' }
      ] : [{type: 'Related',id:'LIST'}]
    })
  })
})

export const {
  useGetRelatedArticlesQuery,
  useAddRelatedArticlesMutation,
  useDetachRelatedArticleMutation

} = related