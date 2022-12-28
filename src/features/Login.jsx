import { Button, Checkbox, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import {Auth} from "../hooks/auth";


export const Login = ()=>{

  const onFinish = (values) => {
    // console.log('Received values of form: ', values)

    Auth.login(values,data=>{
      console.log(data)
      // localStorage.setItem('token', data.token)
      // navigate('/','/login')
    },error=>{
      console.log('error', error)
    })

  }

  return <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
  >
    <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
        ]}
    >
      <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" />
    </Form.Item>
    <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
    >
      <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
      />
    </Form.Item>
    <Form.Item>
      <Form.Item name="remember" valuePropName="checked" noStyle>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" className="login-form-button">
        Log in
      </Button>
    </Form.Item>
  </Form>
}