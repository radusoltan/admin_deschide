import { Button, Card, Spin, Table } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { EditRole, NewRole } from './_form'
import {useGetRolesQuery, useDeleteRoleMutation} from '../../../services/roles'
import { useGetAllPermissionsQuery } from '../../../services/permissions'

const Roles = () => {

  const [roleEdit,setRoleEdit] = useState()
  const [isEdit, setIsEdit] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const {data, isSuccess, isLoading} = useGetRolesQuery()
  const {data: permissions} = useGetAllPermissionsQuery()
  const [deleteRole] = useDeleteRoleMutation()

  if (isLoading){
    return <Spin />
  }

  const dataSource = data?.map((role)=>({
    key: role.id,
    name: role.name,
    permissions: role.permissions
  }))

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (t,{key}) => <a onClick={()=>{
        setRoleEdit(key)
        setIsEdit(true)
      }}>{t}</a>
    },
    {
      render: ({key})=><Button onClick={()=>deleteRole(key)}>Delete</Button>
    }
  ]

  return <Card extra={<Button onClick={()=>{setIsNew(true)}}>Add</Button>}>
    <Table dataSource={dataSource} columns={columns} pagination={false} />
    {roleEdit &&
      <EditRole 
        visible={isEdit} 
        role={data?.find(({id})=>id===roleEdit)} 
        permissions={permissions}
        onCancel={()=>{
          setIsEdit(false)
          setRoleEdit(null)
        }}
        onOk={()=>{
          setIsEdit(false)
          setRoleEdit(null)
        }}
      />
    }
    <NewRole visible={isNew} onOk={()=>{ setIsNew(false) }} onCancel={()=>{setIsNew(false)}} permissions={permissions} />
  </Card>
}

export default Roles