import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import i18n from "../i18n"

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
    Authorization: 'Bearer '+localStorage.getItem('token')
}

const createRequest = url => ({url,headers})

export const categories = createApi({
    reducerPath: 'categories',
  baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ['Categories'],
    endpoints: build => ({
        getCategories: build.query({
            query: ({page, locale}) => createRequest(`/categories?page=${page}&locale=${locale}`),
            providesTags: result => result ? [
                result.data.map(({id})=>({type: 'Categories',id})),
                {type: 'Categories', id: 'PARTIAL-LIST'}
            ] : [{type: 'Categories', id: 'PARTIAL-LIST'}]
        }),
        getCategory: build.query({
            query: ({id}) => createRequest(`/categories/${id}`)
        }),
        addCategory: build.mutation({
            query: data => ({
                url: '/categories',
                method: 'POST',
                body: data,
                headers
            }),
            invalidatesTags: ({id}) => [
                [{type: 'Categories', id}],
                {type: 'Categories', id: 'PARTIAL-LIST'}
            ]
        }),
        updateCategory: build.mutation({
            query: ({id,body}) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                body,
                headers
            }),
            invalidatesTags: ({id}) => [
                [{type: 'Categories', id}],
                {type: 'Categories', id: 'PARTIAL-LIST'}
            ]
        }),
        deleteCategory: build.mutation({
            query: id => ({
                url: `/categories/${id}`,
                method: 'DELETE',
                headers
            }),
            invalidatesTags: result => [{type: 'Categories', id: 'PARTIAL-LIST'}]
        }),
        publishCategory: build.mutation({
            query: ({id,locale}) => ({
                url: `/category/${id}`,
                method: "PATCH",
                body: {locale},
                headers
            }),
            invalidatesTags: ({id}) => [
                [{type: "Categories",id}],
                {type: 'Categories', id: 'PARTIAL-LIST'}
            ]
        })
    })
})

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    usePublishCategoryMutation
} = categories
