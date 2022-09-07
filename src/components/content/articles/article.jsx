import { Button, Card, Form, Space, Input, Row, Col, Spin, Select, Switch, Divider, notification } from 'antd'
import React, { useEffect,useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import i18n from '../../../i18n'
import { useGetArticleQuery, useUpdateArticleMutation } from '../../../services/articles'
import { Editor } from '@tinymce/tinymce-react'
import { ArticleImages } from '../images/articleImages'
import { BodyEditor } from './editor'


export const Article = () => {
  const navigate = useNavigate()
  const { TextArea } = Input
  const {Option} = Select
  const [form] = Form.useForm()
  const {article} = useParams()
  const {data,isLoading,isSuccess} = useGetArticleQuery(article)

  const [articleBody,setArticleBody] = useState()

  const [updateArticle] = useUpdateArticleMutation()
 

  useEffect(()=>{
    if (isSuccess){
      const { translations } = data
      const { body, status, lead } = translations.find(({ locale }) => locale === i18n.language)
      setArticleBody(body)
      // setArticleLead(lead)
    }
  },[isSuccess])

  if (isLoading){
    return <Spin />
  }

  const {is_breaking, is_alert, is_flash, translations, category_id } = data
  const { title, status, lead, body} = translations.find(({locale})=>i18n.language===locale)

  const onFinish = values => {
    console.log(values)
  }

  const save = () => {
    form.validateFields()
    
    const formValues = form.getFieldsValue()

    const body = {
      ...formValues,
      body: articleBody,
      lng: i18n.language
    }

    updateArticle({article,body})

    notification.success({
      message: 'Articol salvat'
    })
    
  }

  const saveAndClose = () => {
    save()
    navigate(`/content/category/${category_id}`)

  }

  const close = () => {
    navigate(`/content/category/${category_id}`)
  }

  return <Card loading={isLoading} extra={
    <Space>
      <Button type="success" onClick={save}>Save</Button>
      <Button type="info" onClick={saveAndClose}>Save & Close</Button>
      <Button type="danger" onClick={close}>Close</Button>
    </Space>
  }>
    <Form
      form={form}
      initialValues={{
        title,
        lead,
        body,
        is_breaking,
        is_alert,
        is_flash,
        status
      }}
      onFinish={onFinish}
    >
      <Form.Item name="title" label="Title">
        <Input size="large" maxLength={200} showCount={true} />
      </Form.Item>
      <Row>
        <Col span={18}>
          <Card>
            <Form.Item name='lead' label='Lead'>
              <TextArea/>
            </Form.Item>

            <BodyEditor 
              initialValue={articleBody} 
              onEdit={body=>{
                // console.log('onBodyEdit', body);
                setArticleBody(body)
              }}
              field={'body'}
            />

          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Form.Item name='status' label="Status">
            <Select >
              <Option value='N'>New</Option>
              <Option value='S'>Submited</Option>
              <Option value='P'>Published</Option>
            </Select>
          </Form.Item>
          <Divider />
            <Form.Item name="is_flash" label="FLASH" valuePropName="checked">
              <Switch defaultChecked={is_flash}  />
            </Form.Item>
            <Form.Item name='is_alert' label="ALERT" valuePropName="checked">
              <Switch defaultChecked={is_alert} />
             </Form.Item>
            <Form.Item name='is_breaking' label="BREAKING" valuePropName="checked">
              <Switch defaultChecked={is_breaking} />
            </Form.Item>
          </Card>
          {/* Article Images */}
          <ArticleImages article={article} />
        </Col>
      </Row>
    </Form>
  </Card>
}
