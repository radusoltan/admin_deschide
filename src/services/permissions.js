import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const permissions = createApi({
  reducerPath: 'permissions',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Permissions'],
  endpoints: build => ({
    getAllPermissions: build.query({
      query: () => createRequest(`/permissions`),
      providesTags: result => result ? [
        ...result.map(({ id }) => ({ type: 'Users', id })),
        { type: 'Permissions', id: 'PARTIAL-LIST' }
      ] : [{ type: 'Permissions', id: 'PARTIAL-LIST' }]
    }),
    addPermission: build.mutation({
      query: body => ({
        url: '/permissions',
        method: "POST",
        body,
        headers
      }),
      // invalidatesTags: response => [[{type: 'Roles', id: response.id}], {type: 'Roles', id: 'LIST'}]
      invalidatesTags: ['Permissions']
    }),
    updatePermission: build.mutation({
      query: ({permission,body}) => ({
        url: `/permissions/${permission}`,
        method: 'PATCH',
        body,
        headers
      }),
      invalidatesTags: ['Permissions']
      // invalidatesTags: response => [
      //   [{type: 'Permissions', id: response.id}],
      //   { type: 'Permissions', id: 'PARTIAL-LIST' }
      // ]
    }),
    deletePermission: build.mutation({
      query: permission => ({
        url: `/permissions/${permission}`,
        method: 'DELETE',
        headers
      }),
      invalidatesTags: ['Permissions']
    })
  })
})

export const {
  useGetAllPermissionsQuery,
  useAddPermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation
} = permissions