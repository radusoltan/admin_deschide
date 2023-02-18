import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const Images = createApi({
  reducerPath: 'Images',
  baseQuery: fetchBaseQuery({baseUrl}),
  tagTypes: ['Images'],
  endpoints: build => ({
    getAllImages: build.query({
      query: (page)=> createRequest(`/images?page=${page}`),
      providesTags: response => response ?
          [
            response.data.map(({id})=>({type: "Images",id})),
            {type: "Images", id: "PARTIAL-LIST"}
          ] : [{type: "Images", id: 'PARTIAL-LIST'}]
      // providesTags: response => response ? [
      //     ...response.data.data.map(({id})=> ({type: "Images", id})),
      //     {type: "Images", id: 'PARTIAL-LIST'}
      // ] : [{type: "Images", id: 'PARTIAL-LIST'}]
    }),
    imageAddMeta: build.mutation({
      query: ({image,body})=>({
        url: `/image/${image}/meta`,
        method: "PATCH",
        body,
        headers
      })
    })
  })

})

export const {
  useGetAllImagesQuery,
  useImageAddMetaMutation

} = Images

export const articleImages = createApi({
  reducerPath: 'articleImages',
  baseQuery: fetchBaseQuery({baseUrl}),
  tagTypes: ['articleImages'],
  endpoints: build => ({
    getImagesByArticle: build.query({
      query: article => createRequest(`/article/${article}/images`),
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
    attachArticleImage: build.mutation({

      query: ({article,selectedImages})=>({
        url: `/article/${article}/attach-images`,
        method: 'POST',
        body: {ids:selectedImages},
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
  useGetRenditionsQuery,
  useAttachArticleImageMutation,
} = articleImages