// import { buildSelectors } from '@reduxjs/toolkit/dist/query/core/buildSelectors'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import i18n from '../i18n'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const articles = createApi({
    reducerPath: 'articles',
    baseQuery: fetchBaseQuery({baseUrl}),
    tagTypes: ['Articles'],
    endpoints: build => ({
      getAllArticles: build.query({
        query: () => createRequest('/articles?locale='.i18n.language),
        providesTags: r => r ? [
          r.map(({ id }) => ({ type: "Articles", id }))
        ] : [{ type: 'Articles', id: 'LIST' }]
      }),
      getArticle: build.query({
        query: article => createRequest(`/articles/${article}?locale=${i18n.language}`),
        // providesTags: response => console.log(response)
        providesTags: ({ id }) => [{ type: 'Articles', id }]
      }),
      getArticlesByCategory: build.query({
        query: ({category,page, q}) => ({
          url: `/category/${category}/articles`,
          headers,
          params: {
            page,
            term: q ? q : '',
            locale: i18n.language
          }
        }),
        providesTags: result => result ? [
          result.data.map(({id})=>({type: 'Articles', id})),
          { type: 'Articles',id:"PARTIAL-LIST"}
        ] : [{ type: 'Articles',id:"PARTIAL-LIST"}]

      }),
      addArticle: build.mutation({
        query: ({category,values}) => ({
          url: baseUrl+`/category/${category}/add-article`,
          method: "POST",
          body: {...values},
          headers
        }),
        invalidatesTags: (result,error,obj) => result ? [
          [{ type: 'Articles', id: result.id}],
          { type: 'Articles', id: "PARTIAL-LIST"}
        ] : [{ type: 'Articles',id:'PARTIAL-LIST'}]
      }),
      updateArticle: build.mutation({
        query: ({article,body}) => ({
          url: `/articles/${article}`,
          method: 'PATCH',
          body,
          headers
        }),
        invalidatesTags: result => [{type:'Articles',id: result.id}]
      }),
      search: build.mutation({
        query: (body) => ({
          url: '/articles/search',
          method: "POST",
          body,
          headers
        })
      }),
      setArticlePublishTime: build.mutation({
        query: ({ id, body }) => ({
          url: `${baseUrl}/article/${id}/publish-time`,
          method: "POST",
          body,
          headers
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Articles', id }]
      }),
      deleteArticlePublishTime: build.mutation({
        query: id => ({
          url: `/translation/${id}/delete-event`,
          method: 'DELETE',
          headers
        }),
        invalidatesTags: (res, error, {id}) => [{ type: 'Articles', id: res.id}]
      })
    })
})

export const {
    useGetArticleQuery,
    useGetArticlesByCategoryQuery,
    useAddArticleMutation,
    useUpdateArticleMutation,
    useSetArticlePublishTimeMutation,
    useGetAllArticlesQuery,
    useSearchMutation,
    useDeleteArticlePublishTimeMutation,
    useUpdateIsAlertMutation,
    useUpdateIsFlashMutation,
    useUpdateIsBreakingMutation,
    useSearchByCategoryQuery
} = articles