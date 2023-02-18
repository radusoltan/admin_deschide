import {Card, Modal, Form, Input, Image, Button} from "antd";
import {useImageAddMetaMutation} from "../../../services/images";
import i18n from "../../../i18n";

export const EditMeta = ({visible, images, onOk, onCancel}) => {

  const [addMeta] = useImageAddMetaMutation()
  const onFinish = ({image,values}) => {
    addMeta({image,body: {...values, locale: i18n.language}})

  }



  const forms = images.map(({id,path, name, translations})=>{
    if (translations.length === 0){
      return <Card key={id} cover={<Image src={process.env.REACT_APP_URL+path} />}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={(props)=>onFinish({image: id, values: props})}
          autoComplete="off"
        >
          <Form.Item label="author" name="author">
            <Input />
          </Form.Item>
          <Form.Item label="title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    } else {

      const {author, title, description} = translations.find(({locale})=>locale===i18n.language)

      return <Card key={id} cover={<Image src={process.env.REACT_APP_URL+path} />}>
        <Form name="not_empty"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={(props)=>onFinish({image: id, values: {...props}})}
          initialValues={{
            author,
            title,
            description
          }}
          autoComplete="off">
          <Form.Item label="author" name="author">
            <Input />
          </Form.Item>
          <Form.Item label="title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>

    }
  })
  return <Modal
    visible={visible}
    onOk={()=>{
      onOk()
    }}
    onCancel={()=>{onCancel()}}
    with={'80%'}
  >
    <Card>
      {
        forms
      }
    </Card>
  </Modal>
}
