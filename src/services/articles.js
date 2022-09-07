import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
      getArticle: build.query({
        query: article => createRequest(`/articles/${article}`),
        providesTags: ({ id }) => [{ type: 'Articles', id }]
      }),
      getArticlesByCategory: build.query({
        query: ({category,page,q}) => {
          const term = q ===null ? '' : q
          // console.log(term);
          return {
            url: `/category/${category}/articles`,
            headers,
            params: {
              page,
              term,
              locale: 'ro'
            }
          }
          // createRequest(`/category/${category}/articles?page=${page}`)
        },
        providesTags: result => result ? [
            ...result.data.map(({id})=>({type:'Articles',id}))
        ] : [{type:'Articles',id:'PARTIAL-LIST'}]
          
      }),
      addArticle: build.mutation({
        query: ({category,values}) => ({
          url: baseUrl+`/category/${category}/add-article`,
          method: "POST",
          body: values,
          headers
        }),
        invalidatesTags: (result,error,obj) => console.log('articles API inv obj', obj)
      }),
      updateArticle: build.mutation({
        query: ({article,body}) => ({
          url: `/articles/${article}`,
          method: 'PATCH',
          body,
          headers
        }),
        invalidatesTags: result => [{type: 'Articles', id: result.id}]
      })
    })
})

export const {
    useGetArticleQuery,
    useGetArticlesByCategoryQuery,
    useAddArticleMutation,
    useUpdateArticleMutation
} = articles