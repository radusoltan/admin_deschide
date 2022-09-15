import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const roles = createApi({
  reducerPath: 'roles',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Roles'],
  endpoints: build => ({
    getRoles: build.query({
      query: () => createRequest('/roles'),
      providesTags: response => response ? [
        ...response.map(({id})=>({type: 'Roles', id})),
        {type: 'Roles',id:'LIST'}
      ] : [{type: 'Roles',id: 'LIST'}]
    }),
    updateRole: build.mutation({
      query: ({role,body}) => ({
        url: `/roles/${role}`,
        method: 'PATCH',
        body,
        headers
      }),
      // invalidatesTags: response => [response.map(({id})=>({type: 'Roles', id})),{type:'Roles',id:'LIST'}]
      invalidatesTags: ['Roles']
    }),
    addRole: build.mutation({
      query: body => ({
        url: '/roles',
        method: "POST",
        body, 
        headers
      }),
      // invalidatesTags: response => [[{type: 'Roles', id: response.id}], {type: 'Roles', id: 'LIST'}]
      invalidatesTags: ['Roles']
    }),
    deleteRole: build.mutation({
      query: role => ({
        url: `/roles/${role}`,
        method: "DELETE",
        headers
      }),
      invalidatesTags: ['Roles']
    })
    
  })
})

export const {
  useGetRolesQuery,
  useUpdateRoleMutation,
  useAddRoleMutation,
  useDeleteRoleMutation
} = roles