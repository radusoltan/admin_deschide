
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const imageThumbnails = createApi({
  reducerPath: 'imageThumbnails',
  baseQuery: fetchBaseQuery({baseUrl}),
  tagTypes: ['imageThumbnails'],
  endpoints: build => ({
    getImageThumbnails: build.query({
      query: image => createRequest(`/image/${image}/thumbnails`),
      providesTags: result => result ?
      [
        ...result.map(({ id }) => ({ type:'imageThumbnails', id})),
        {type:'imageThumbnails',id:'LIST'}
      ] : [{type:'imageThumbnails',id:'LIST'}]
    }),
    cropImage: build.mutation({
      query: ({ image, rendition, crop }) => ({
        url: `/image/${image}/crop`,
        method: 'POST',
        body: { rendition, crop },
        headers
      }),
      invalidatesTags: (result) => [{ type: 'imageThumbnails', id: result.id }]      
    })
  })
})

export const {
  useGetImageThumbnailsQuery,
  useCropImageMutation
} = imageThumbnails