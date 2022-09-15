import { Card, Form, Input, Modal } from 'antd'
import React from 'react'
import { useAddPermissionMutation, useUpdatePermissionMutation } from '../../../services/permissions'

export const EditPermission = ({visible, onOk, onCancel, permission}) => {
  const [form] = Form.useForm()
  const [updatePermission] = useUpdatePermissionMutation()
  
  return <Modal 
    visible={visible} 
    onOk={()=>{
      form.validateFields()
       .then(values=>{
        updatePermission({
          permission: permission.id,
          body: {...values}
        })
        onOk()
       })
    }} 
    onCancel={()=>{
      onCancel()
    }}
  >
    <Card>
      <Form 
        form={form} 
        initialValues={{
          name: permission.name
        }}
      >
        <Form.Item name="name">
          <Input />
        </Form.Item>

      </Form>
    </Card>
  </Modal>
}

export const NewPermission = ({visible, onOk, onCancel}) => {
  const [form] = Form.useForm()
  const [addPermission] = useAddPermissionMutation()
  return <Modal
    visible={visible}
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          const body = {...values}
          addPermission(body)
          
          onOk()
        })

        form.resetFields()

    }}
    onCancel={()=>{
      form.resetFields()
      onCancel()
    }}
  >
    <Card>
      <Form form={form}>
        <Form.Item name='name'>
          <Input />
        </Form.Item>
      </Form>
    </Card>
    
  </Modal>

}

