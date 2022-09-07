import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseURL = process.env.REACT_APP_API_URL
const headers = {
    Authorization: 'Bearer '+localStorage.getItem('token')
}

const createRequest = url => ({url,headers})

export const categories = createApi({
    reducerPath: 'categories',
    baseQuery: fetchBaseQuery({baseURL}),
    tagTypes: ['Categories'],
    endpoints: build => ({
        getCategories: build.query({
            query: page => createRequest(baseURL+`/categories?page=${page}`),
            providesTags: result => result ? [
                ...result.data.map(({id})=>({type: 'Categories',id})),
                {type: 'Categories', id: 'PARTIAL-LIST'}
            ] : [{type: 'Categories', id: 'PARTIAL-LIST'}]
        }),
        getCategory: build.query({
            query: ({id}) => createRequest(baseURL+`/categories/${id}`)
        }),
        addCategory: build.mutation({
            query: data => ({
                url: baseURL+'/categories',
                method: 'POST',
                body: data,
                headers
            }),
            invalidatesTags: [{ type: 'Categories', id: 'PARTIAL-LIST' }]
        }),
        updateCategory: build.mutation({
            query: ({id,body}) => ({
                url: baseURL+`/categories/${id}`,
                method: 'PATCH',
                body,
                headers
            }),
            invalidatesTags: (result,error,{id}) => [{type: 'Categories',id}]
        }),
        deleteCategory: build.mutation({
            query: id => ({
                url: baseURL+`/categories/${id}`,
                method: 'DELETE',
                headers
            }),
            invalidatesTags: (result,error,id) => [{type:'Categories', id}]
        }),
        publishCategory: build.mutation({
            query: (id) => ({
                url: baseURL+`/category/${id}`,
                method: "PATCH",
                body: {},
                headers
            }),
            invalidatesTags: (res,err,id) => [{type:'Categories', id}]
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
