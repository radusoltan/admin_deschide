import {Card, Form, Image, Input, Modal} from "antd";
import {useGetImageQuery, useSetImageMetaMutation} from "../../../services/images";
import {useEffect, useState} from "react";
import TextArea from "antd/es/input/TextArea";

export const ImageMetaForm = ({visible, image, onCancel}) => {



  const [form] = Form.useForm()
  const {data, isSuccess} = useGetImageQuery(image)
  const [imageName, setImageName] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [imageTitle, setImageTitle] = useState('');

  const [editMeta] = useSetImageMetaMutation()

  useEffect(() => {
    if (isSuccess) {
      setImageName(data.name)
      setImageTitle(data.title)
      setImageDescription(data.description)
      const path = process.env.REACT_APP_URL + data.path + `/${data.name}`
      setImageName(path)
    }
  }, [isSuccess]);

  console.log('Image Meta Form', imageName)



  return <Modal title={"Image Meta Edit"} visible={visible} onCancel={()=>{
    setImageTitle('')
    setImageDescription('')
    setImageName('')

    onCancel()}
  } onOk={()=>{
    form.validateFields()
        .then(values=>{

          console.log(values)

        })
  }} >
    <Card
      title={"Image TITLE"}
      cover={<Image src={imageName} preview={false} />}
    >
      <Form form={form} name="edit_image_meta">
        <Form.Item
          name='name'
          label="Image Name"
          initialValue={imageTitle}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Image Description" initialValue={imageDescription}>
          <TextArea />
        </Form.Item>
      </Form>
    </Card>
  </Modal>
}