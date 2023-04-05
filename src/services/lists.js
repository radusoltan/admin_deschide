import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import i18n from '../i18n'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}
const createRequest = url => ({ url, headers })

export const lists = createApi({
  reducerPath: 'lists',
  baseQuery: fetchBaseQuery({baseUrl}),
  tagTypes: ["Lists",'ListItems'],
  endpoints: (build) => ({
    getLists: build.query({
      query: () => createRequest('/lists'),
      providesTags: r => r ? [
        r.map(({id})=>(
            {type: 'Lists', id},
            {type: 'Lists', id: "LIST"}
        ))
      ] : [{type: 'Lists', id: "LIST"}]
    }),
    getList: build.query({}),
    addList: build.mutation({}),
    updateList: build.mutation({

    }),
    addArticleToList: build.mutation({
      query: ({list, article}) => ({
        url: `/list/${list}/attach`,
        method: 'POST',
        body: {article},
        headers
      }),
      invalidatesTags: r => [
          {type:'Lists',id: r.id},
          r.articles.map(article =>({type: 'ListItems',id: article.id}))
      ]
    }),
    detachArticleFromList: build.mutation({
      query: ({list, article}) => ({
        url: `/list/${list}/detach`,
        method: 'POST',
        body: {article},
        headers
      }),
      invalidatesTags: r => [
          {type:'Lists',id: r.id},
          r.articles.map(article => ({type: 'ListItems', id: article.id}))
      ]
    })
  })
})

export const {
  useGetListsQuery,
  useGetListQuery,
  useAddListMutation,
  useAddArticleToListMutation,
  useDetachArticleFromListMutation
} = lists