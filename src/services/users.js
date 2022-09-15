
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = url => ({ url, headers })

export const users = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Users'],
  endpoints: build => ({
    getUsers: build.query({
      query: page => createRequest(`/users?page=${page}`),
      providesTags: result => result ? [
        ...result.data.map(({ id }) => ({ type: 'Users', id })),
        { type: 'Users', id: 'PARTIAL-LIST' }
      ] : [{ type: 'Users', id: 'PARTIAL-LIST' }]
    }),
    addUser: build.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
        headers
      }),
      invalidatesTags: ({id}) => [[{type: 'Users',id}],{type: 'Users',id:'PARTIAL-LIST'}]
    }),
    updateUser: build.mutation({
      query: ({user,body}) => ({
        url: `/users/${user}`,
        method: 'PATCH',
        body,
        headers
      })
    }),
    deleteUser: build.mutation({
      query: user => ({
        url: `/users/${user}`,
        method: 'DELETE',
        headers
      }),
      invalidatesTags: (r,e,id) => [[{type: 'Users',id}],{type: 'Users', id: 'PARTIAL-LIST'}]
    })
  })

})

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation
} = users 