import React from 'react'
import {Card, Form, Input, Modal} from "antd"
const AddAuthor  = ({visible, onOk, onCancel}) => {

  const [form] = Form.useForm()
  return <Modal
    visible={visible}
    onOk={()=>{
      form.validateFields()
        .then((values)=>{
          onOk(values)
        })
    }}
    onCancel={onCancel}
  >
    <Card >
      <h4>Add new</h4>
      <Form form={form}>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[
            {
              required: true,
              message: 'Please input First Name!',
            },
          ]}
        >
          <Input  />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[
            {
              required: true,
              message: 'Please input Last Name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Card>
  </Modal>
}
export default AddAuthor;