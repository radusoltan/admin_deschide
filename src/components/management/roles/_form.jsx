import { Card, Form, Modal, Input, Checkbox } from 'antd'
import React, {useState} from 'react'


import { useUpdateRoleMutation, useAddRoleMutation } from '../../../services/roles'

export const NewRole = ({visible, onOk, onCancel, permissions}) => {
  const [form] = Form.useForm()
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [newRole] = useAddRoleMutation()
  const handlePermissions = vals => setSelectedPermissions(vals)
  return <Modal
    visible={visible}
    onOk={()=>{
      form.validateFields()
       .then(values=>{
        const body = {
          ...values,
          selectedPermissions
        }
        newRole(body)
        form.resetFields()
        onOk()
       })      
    }}
    onCancel={onCancel}
  >
    <Card>
      <Form form={form}>
        <Form.Item name="name">
          <Input />
        </Form.Item>
        <Checkbox.Group onChange={handlePermissions}>
          {
            permissions?.map(({id,name})=>(<Checkbox value={id} key={id}>{name}</Checkbox>))
          }
        </Checkbox.Group>
      </Form>
    </Card>
  </Modal>
}

export const EditRole = ({visible, onOk, onCancel, role, permissions}) => {
  const [form] = Form.useForm()
  // const {data, isLoading, isSuccess} = useGetAllPermissionsQuery()
  const [selectedPermissions, setSelectedPermissions] = useState(role.permissions?.map(({id})=>(id)))
  const [updateRole] = useUpdateRoleMutation()
  const handlePermissions = vals => {
    setSelectedPermissions(vals)
  }

  return <Modal 
    visible={visible} 
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          updateRole({
            role: role.id,
            body: {...values,selectedPermissions}
          })
          form.resetFields()
        })
      onOk()
    }} 
    onCancel={()=>{
      onCancel()
      form.resetFields()
    }}
  >
    <Card>
      <Form 
        form={form}
        initialValues={{
          name: role.name,
        }}
      >
        <Form.Item name="name">
          <Input />
        </Form.Item>

        <Checkbox.Group defaultValue={role.permissions?.map(({id})=>(id))} onChange={handlePermissions}>
          {
            permissions?.map(permission=>(<Checkbox value={permission.id} key={permission.id} checked={true}>{permission.name}</Checkbox>))
          }
        </Checkbox.Group>

      </Form>
    </Card>
  </Modal>
}