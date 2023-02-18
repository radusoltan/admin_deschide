import {Button, Card, Col, Divider, Form, Input, notification, Row, Select, Space, Spin, Switch} from 'antd'
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import i18n from '../../../i18n'
import {
  useGetArticleQuery,
  useUpdateArticleMutation,
  useUpdateIsAlertMutation, useUpdateIsBreakingMutation,
  useUpdateIsFlashMutation
} from '../../../services/articles'
import ArticleAuthors from '../authors/ArticleAuthors'
import {BodyEditor} from "./editor";
import {ArticleImages} from "../images/articleImages";

export const ___article = () => {

  const {article} = useParams()
  const [form] = Form.useForm()
  const {Option} = Select

  const {data, isLoading, isSuccess, isError} = useGetArticleQuery(article)
  const [updateArticle,{data:updateData, isSuccess: updateIsSuccess, isError: updateIsError, isLoading: updateIsLoading}] = useUpdateArticleMutation()
  // const [updateIsFlash,{data: updateIsFlashData, isSuccess: updateIsFlashIsSuccess}] = useUpdateIsFlashMutation(article)
  // const [updateIsAlert,{data: updateIsAlertData, isSuccess:updateIsAlertIsSuccess}] = useUpdateIsAlertMutation(article)
  // const [updateIsBreaking,{data: updateIsBreakingData, isSuccess:updateIsBreakingIsSuccess}] = useUpdateIsBreakingMutation(article)

  const [articleBody,setArticleBody] = useState()
  const [articleIsAlert,setArticleIsAlert] = useState(false)
  const [articleIsBreaking,setArticleIsBreaking] = useState(false)
  const [articleIsFlash,setArticleIsFlash] = useState(false)

  useEffect(()=>{

    if (updateIsSuccess){
      const {is_flash, is_alert, is_breaking, translations} = updateData
      articleIsFlash(is_flash)
      articleIsBreaking(is_breaking)
      articleIsAlert(is_alert)
      console.log('Updated', updateData)
      const {title, lead, body} = translations.find(({locale})=>locale===i18n.language)
      setArticleBody(body)
      // notification.success({
      //   message: 'Articol salvat'
      // })
    }
    if (isSuccess){
      const { translations, is_flash, is_alert, is_breaking } = data
      const { body } = translations.find(({ locale }) => locale === i18n.language)
      setArticleBody(body)
      setArticleIsBreaking(is_breaking)
      setArticleIsAlert(is_alert)
      setArticleIsFlash(is_flash)
    }
    // if (updateIsFlashIsSuccess){
    //   const {is_flash, is_alert, is_breaking} = updateIsFlashData
    //   setArticleIsAlert(is_alert)
    //   setArticleIsFlash(is_flash)
    //   setArticleIsBreaking(is_breaking)
    // }
    //
    // if (updateIsAlertIsSuccess){
    //
    //   const {is_flash, is_alert, is_breaking} = updateIsAlertData
    //   setArticleIsAlert(is_alert)
    //   setArticleIsFlash(is_flash)
    //   setArticleIsBreaking(is_breaking)
    //
    // }
    //
    // if (updateIsBreakingIsSuccess){
    //   const {is_flash, is_alert, is_breaking} = updateIsBreakingData
    //   setArticleIsAlert(is_alert)
    //   setArticleIsFlash(is_flash)
    //   setArticleIsBreaking(is_breaking)
    // }

  },[
            updateIsSuccess,
            isSuccess,
            // updateIsFlashIsSuccess,
            // updateIsAlertIsSuccess,
            // updateIsBreakingIsSuccess
  ])

  const handleTypeChange = (type)=>{

    if (type === 'is_flash'){
      // setArticleIsBreaking(false)
      // setArticleIsAlert(false)
      // setArticleIsFlash(true)
      // updateIsFlash(article)
    } else if(type==='is_alert') {
      // setArticleIsBreaking(false)
      // setArticleIsAlert(true)
      // setArticleIsFlash(false)
      // updateIsAlert(article)
    } else if ('is_breaking') {
      // setArticleIsBreaking(true)
      // setArticleIsAlert(false)
      // setArticleIsFlash(false)
      // updateIsBreaking(article)
    }

  }

  const save = ()=>{
    form.validateFields()

    const formValues = form.getFieldsValue()


    const body = {
      ...formValues,
      body: articleBody,
      lng: i18n.language
    }
    updateArticle({article,body})



  }

  const saveAndClose = ()=>{}

  const close = ()=>{

  }

  if (isLoading){
    return <Spin />
  }

  const {translations } = data

  const { title, status, lead, body} = translations.find(({locale})=>i18n.language===locale)

  return <Card 
    loading={isLoading} 
    extra={<Space>
      <Button onClick={save} type='success'>Save</Button>
      <Button type="info" onClick={saveAndClose}>Save & Close</Button>
      <Button type="danger" onClick={close}>Close</Button>
    </Space>}>

    <Form form={form} initialValues={{
      title: ar,
      lead,
      body,
      is_breaking: articleIsBreaking,
      is_alert: articleIsAlert,
      is_flash: articleIsFlash,
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
              <Switch onChange={()=>handleTypeChange('is_flash')} defaultChecked={articleIsFlash} />
            </Form.Item>
            <Form.Item name='is_alert' label="ALERT" valuePropName="checked">
              <Switch onChange={()=>handleTypeChange('is_alert')} defaultChecked={articleIsAlert} />
            </Form.Item>
            <Form.Item name='is_breaking' label="BREAKING" valuePropName="checked">
              <Switch onChange={()=>handleTypeChange('is_breaking')} defaultChecked={articleIsBreaking} />
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