import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const articleImages = createApi({
  reducerPath: 'articleImages',
  baseQuery: fetchBaseQuery({baseUrl}),
  tagTypes: ['articleImages'],
  endpoints: build => ({
    getImagesByArticle: build.query({
      query: (id) => createRequest(`/article/${id}/images`),
      // query: article => {
      //   console.log(article)
      // },
      providesTags: result => result ? [
        ...result.map(({ id }) => ({ type:'articleImages',id})),
        {type:'articleImages', id: 'LIST'}
      ] : [{ type:'articleImages', id: 'LIST'}]
    }),
    detachArticleImage: build.mutation({
      query: ({article,id}) => ({
        url: `/article/${article}/detach-images`,
        method: 'POST',
        body: {id},
        headers
      }),
      invalidatesTags: result => result ? [
        ...result.map(({id})=>({type: 'articleImages',id})),
        {type:'articleImages',id:'LIST'}
      ] : [{type:'articleImages',id:'LIST'}]
    }),
    uploadArticleImages: build.mutation({
      query: ({article, body}) => ({
        url: `/article/${article}/upload-images`,
        method: 'POST',
        body,
        headers  
      }),
      invalidatesTags: result => result ? [
        ...result.map(({id})=>({type:'articleImages',id})),
        {type:'articleImages',id:'LIST'}
      ] : [{ type: 'articleImages', id: 'LIST' }]
    }),
    setArticleMainImage: build.mutation({
      query: ({article,image}) => ({
        url: '/image/set-main',
        method: 'POST',
        body: {article,image},
        headers
      }),
      invalidatesTags: result => result ? 
      [
        [{ type: 'articleImage', id: result.image_id }],
        { type: 'articleImages', id: 'LIST' }
      ] : [{ type: 'articleImages', id: 'LIST' }]
    }),
    getRenditions: build.query({
      query: () => createRequest('/renditions')
    }),
    
  })
})

export const {
  useGetImagesByArticleQuery,
  useDetachArticleImageMutation,
  useUploadArticleImagesMutation,
  useSetArticleMainImageMutation,
  useGetRenditionsQuery
} = articleImages