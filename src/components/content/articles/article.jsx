import { Card, Spin, Form, Input, Space, Button, Row, Col } from 'antd'
import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import i18n from '../../../i18n'
import { useGetArticleQuery } from '../../../services/articles'
import ArticleAuthors from '../authors/ArticleAuthors'

export const Article = () => {

  const {article} = useParams()
  const [form] = Form.useForm()

  const {data, isLoading, isSuccess, isError} = useGetArticleQuery(article)  

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

      <ArticleAuthors article={article} />

      <Row>
        <Col span={18}>
          <Card>
            <Form.Item name='lead' label='Lead'>
              <Input.TextArea/>
            </Form.Item>
          </Card>
        </Col>
      </Row>

    </Form>

  </Card>
}