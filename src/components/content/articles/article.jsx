import {Card, Spin, Form, Input, Space, Button, Row, Col, Select, Divider, Switch} from 'antd'
import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import i18n from '../../../i18n'
import { useGetArticleQuery } from '../../../services/articles'
import ArticleAuthors from '../authors/ArticleAuthors'
import {BodyEditor} from "./editor";
import {ArticleImages} from "../images/articleImages";

export const Article = () => {

  const {article} = useParams()
  const [form] = Form.useForm()
  const {Option} = Select

  const {data, isLoading, isSuccess, isError} = useGetArticleQuery(article)

  const [articleBody,setArticleBody] = useState()

  const save = ()=>{
    console.log(form.getFieldValue())
  }

  const saveAndClose = ()=>{}

  const close = ()=>{}

  if (isLoading){
    return <Spin />
  }

  const {is_breaking, is_alert, is_flash, translations, category_id } = data

  const { title, status, lead, body} = translations.find(({locale})=>i18n.language===locale)

  return <Card 
    loading={isLoading} 
    extra={<Space>
      <Button onClick={save} type='success'>Save</Button>
      <Button type="info" onClick={saveAndClose}>Save & Close</Button>
      <Button type="danger" onClick={close}>Close</Button>
    </Space>}>

    <Form form={form} initialValues={{
      title,
      lead,
      body,
      is_breaking,
      is_alert,
      is_flash,
      status
    }}>

      <Form.Item name="title" label="Title">
        <Input size="large" maxLength={200} showCount={true} />
      </Form.Item>



      <Row>
        <Col span={18}>
          <Card>
            <Form.Item name='lead' label='Lead'>
              <Input.TextArea/>
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
          <ArticleAuthors
            article={article}

          />
          <ArticleImages article={article} />
        </Col>
      </Row>

    </Form>

  </Card>
}