import { Card, Table, Alert, Pagination, Button } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useGetUsersQuery, useDeleteUserMutation } from '../../../services/users'
import { Link } from 'react-router-dom'
import { NewUserForm } from './_form'

const Users = () => {
  const [page,setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isNew, setIsNew] = useState(false)




  const {data: users, isLoading: usersLoading, isSuccess: usersSuccess} = useGetUsersQuery(page)
  const [deleteUser] = useDeleteUserMutation()

  useEffect(()=>{
    if (usersSuccess){
      // setUsers(usersData)
      setIsLoading(false)
    }

    if (usersLoading) {
      setIsLoading(true)
    }

  },[usersSuccess])

  const pageChange = page => {

    setPage(page)
  }

  const dataSource = users?.data.map(user=>({
    key: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles
  }))

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (t,{key}) => <Link to={`/management/user/${key}`} >{t}</Link>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      render: o => o.map(({name,id})=><Alert message={name} type="success" key={id} />)
    },
    {
      title: '',
      render: ({key})=><>
        <Button onClick={()=>{
          deleteUser(key)
        }}>delete</Button>
      </>
    }
  ]
  const {total, current_page,per_page} = users ? users : {total:0,current_page:1,per_page: 10}
  return !isLoading && <Card loading={isLoading} extra={<Button onClick={()=>setIsNew(true)}>Add</Button>}>
    <Table dataSource={dataSource} columns={columns} pagination={false} />
    <Pagination onChange={pageChange} total={total} pageSize={per_page} current={current_page} />
    <NewUserForm visible={isNew} onCancel={()=>setIsNew(false)} onOk={()=>setIsNew(false)} />
  </Card>
}

export default Users