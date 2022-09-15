import { Button, Card, Spin, Table } from 'antd'
import React from 'react'
import { useState } from 'react'
import { useGetAllPermissionsQuery, useDeletePermissionMutation } from '../../../services/permissions'
import { EditPermission, NewPermission } from './_form'

const Permissions = () => {
  const [permissionEdit, setPermissionEdit] = useState()
  const [isEdit, setIsEdit] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const {data, isLoading} = useGetAllPermissionsQuery()
  const [deletePermission] = useDeletePermissionMutation()

  if (isLoading){
    return <Spin />
  }

  const dataSource = data?.map(permission=>({
    key: permission.id,
    name: permission.name
  }))

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (t,{key}) => <a onClick={()=>{
        setIsEdit(true)
        setPermissionEdit(key)
      }}>{t}</a>
    },
    {
      render: ({key}) => <Button onClick={()=>deletePermission(key)}>Delete</Button>
    }
  ]

  return <Card extra={<Button onClick={()=>setIsNew(true)} >Add</Button>}>
    <Table dataSource={dataSource} columns={columns} pagination={false} />
    <NewPermission visible={isNew} onCancel={()=>setIsNew(false)} onOk={()=>setIsNew(false)} />
    {permissionEdit &&
      <EditPermission 
        visible={isEdit} 
        permission={data?.find(({id})=>id===permissionEdit)}
        onCancel={()=>{
          setIsEdit(false)
          setPermissionEdit()
        }}
        onOk={()=>{
          setIsEdit(false)
          setPermissionEdit()
        }} 
      />
    }
  </Card>
}

export default Permissions