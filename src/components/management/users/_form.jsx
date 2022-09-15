import { Form, Modal, Card, Input, Checkbox } from 'antd'
import React, {useState} from 'react'
import { useGetRolesQuery } from '../../../services/roles';
import { useAddUserMutation } from '../../../services/users';

export const NewUserForm = ({visible, onCancel, onOk}) => {
  const [selectedRoles, setSelectedRoles] = useState([])
  const [form] = Form.useForm();
  const {data: roles} = useGetRolesQuery()
  const [addNewUser] = useAddUserMutation()
  
  const handleRroles = vals => {
setSelectedRoles(vals)
  }

  return <Modal 
    visible={visible} 
    onCancel={onCancel} 
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          addNewUser({...values,selectedRoles})
          onOk()
        })
    }}
  >
    <Card>
      <Form form={form}>
        <Form.Item name="name" rules={[{ required: true, message: 'Please input new User Name!' }]} >
          <Input placeholder='User Name'/>
        </Form.Item>
        <Form.Item name='email' rules={[{ required: true, message: 'Please input new User Email!' }]} >
          <Input type='email' placeholder='User Email'/>
        </Form.Item>
        <Form.Item name='password' rules={[{ required: true, message: 'Please input new User Password!' }]} >
          <Input.Password  type='password' placeholder='Password'/>
        </Form.Item>
        <Form.Item name="password_confirmation" >
          <Input.Password  type='password' placeholder='Confirm Password'/>
        </Form.Item>
        <Form.Item name='roles'>
          <h3>Roles</h3>
          <Checkbox.Group onChange={handleRroles}>
            {
              roles?.map(role=><Checkbox value={role.id} key={role.id}>{role.name}</Checkbox>)
            }
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Card>
  </Modal>
}

