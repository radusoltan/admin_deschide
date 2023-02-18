import {
  useDeleteArticlePublishTimeMutation,
  useGetArticleQuery, useSetArticlePublishTimeMutation,
  useUpdateArticleMutation
} from "../../../services/articles"
import {useNavigate, useParams} from "react-router-dom"
import {Button, Card, Col, Divider, Input, notification, Row, Select, Space, Switch} from "antd"
import React, {useEffect, useState} from "react"
import {BodyEditor} from "./Editor"
import {SubmitEvent} from "./Event"
import i18n from "./../../../i18n"
import {ArticleImages} from "../Media/Images/ArticleImages";

export const Article = ()=>{
  const {article} = useParams()
  const navigate = useNavigate()
  const {data, isLoading, isSuccess} = useGetArticleQuery(article)
  const [updateArticle,{data: updateArticleData,isLoading: updateArticleDataIsLoading, isSuccess: updateArticleIsSuccess}] = useUpdateArticleMutation()
  const [deleteEvent, {data: deleteEventData,isSuccess: deleteEventSuccess}] = useDeleteArticlePublishTimeMutation()
  const [setArticlePublishTime,{data: setEventData, isSuccess: setEventSuccess, isLoading: setEventLoading}] = useSetArticlePublishTimeMutation()
  const {Option} = Select

  const [title, setTitle] = useState('')
  const [lead, setLead] = useState('')
  const [body, setBody] = useState('')
  const [isFlash, setIsFlash] = useState(false)
  const [isBreaking, setIsBreaking] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const [status, setStatus] = useState('')
  const [visits, setVisits] = useState(0)
  const [publishAt, setPublishAt] = useState('')
  const [translationId, setTranslationId] = useState('')
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (isSuccess){
      const {category_id, title, body, lead, status, is_flash, is_breaking, is_alert, visits, publish_at, translations} = data
      const translationId = translations.find(translation=>i18n.language===translation.locale).id
      setState(title, lead, body, is_flash, is_breaking, is_alert,status, visits.score, publish_at, translationId, category_id)
    }
    if (deleteEventSuccess){
      const {category_id, title, body, lead, status, is_flash, is_breaking, is_alert, visits, publish_at, translations} = deleteEventData
      const translationId = translations.find(translation=>i18n.language===translation.locale).id
      setState(title, lead, body, is_flash, is_breaking, is_alert,status, visits.score, publish_at, translationId, category_id)
    }
    if (updateArticleIsSuccess){
      const {category_id, title, body, lead, status, is_flash, is_breaking, is_alert, visits, publish_at, translations} = updateArticleData
      const translationId = translations.find(translation=>i18n.language===translation.locale).id
      setState(title, lead, body, is_flash, is_breaking, is_alert,status, visits.score, publish_at, translationId, category_id)
      notification.success({
        message: 'Articol salvat',
        duration: 2
      })
    }
    if (setEventSuccess){
      const {category_id, title, body, lead, status, is_flash, is_breaking, is_alert, visits, publish_at, translations} = setEventData
      const translationId = translations.find(translation=>i18n.language===translation.locale).id
      setState(title, lead, body, is_flash, is_breaking, is_alert,status, visits.score, publish_at, translationId, category_id)
    }
  }, [isSuccess, deleteEventSuccess, updateArticleIsSuccess, setEventSuccess]);


  const setState = (
    title,
    lead,
    body,
    is_flash,
    is_breaking,
    is_alert,
    status,
    visits,
    publish_at,
    translationId,
    category_id

  )=>{
    setTitle(title)
    setLead(lead)
    setBody(body)
    setIsFlash(is_flash)
    setIsAlert(is_alert)
    setIsBreaking(is_breaking)
    setStatus(status)
    setVisits(visits)
    setPublishAt(publish_at)
    setTranslationId(translationId)
    setCategoryId(category_id)
  }

  const articleBody = {
    title,
    lead,
    body,
    is_flash: isFlash,
    is_breaking: isBreaking,
    is_alert: isAlert,
    status,
    categoryId,
    lng: i18n.language
  }

  const save = () => {
    const arr = [
      isBreaking,
      isAlert,
      isBreaking
    ]
    let check = arr => arr.every(v=>v===true)
    if (check(arr)){
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else if (isFlash && isBreaking){
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else if (isAlert && isBreaking){
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else if (isAlert && isFlash){
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else {
      updateArticle({article,body: articleBody})
    }
  }
  const saveAndClose = () => {
    save()
    setTimeout(()=>navigate(`/content/categories/${categoryId}`),2000)
  }
  const close = () => navigate(`/content/categories/${categoryId}`)

  const handleTitleChange = title => {
    setTitle(title.target.value)
  }

  const handleLeadChange = lead => {
    setLead(lead.target.value)
  }

  const handleStatusChange = status => {
    setStatus(status)
  }

  return <Card
    title={`Visits: ${title} // ${visits}`}
    loading={isLoading || updateArticleDataIsLoading || setEventLoading}
    extra={<Space direction="horizontal">
      <Button type="success" onClick={save}>Save</Button>
      <Button type="info" onClick={saveAndClose}>Save & Close</Button>
      <Button type="danger" onClick={close}>Close</Button>
    </Space>}
  >
    <Input size="large" maxLength={200} showCount={true} onChange={handleTitleChange} value={title} />
    <Row>
      <Col span={18}>
        <Card>
          <Input.TextArea value={lead} onChange={handleLeadChange} />
          <BodyEditor
            initialValue={body}
            onEdit={body=>setBody(body)}
            field={'body'}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Select onChange={handleStatusChange} value={status} >
            <Option value='N'>New</Option>
            <Option value='S'>Submitted</Option>
            <Option value='P'>Published</Option>
          </Select>
          {
            status==="S" ? (
              <SubmitEvent
                article={article}
                eventPublish={publishAt}
                deleteEvent={()=>deleteEvent(translationId)}
                setEvent={(time)=>{
                  setArticlePublishTime({
                    id: article,
                    body: {
                      locale: i18n.language,
                      time: time
                    }
                  })
                }}
              />
            ) : ('')
          }
          <Divider />
          <Card>
            <>
              <p>FLASH</p>
              <Switch
                  onChange={(prop)=> {
                    setIsFlash(prop)
                  }}
                  onClick={(prop)=> {
                    setIsFlash( prop)
                  }}
                  checked={isFlash}
              />
            </>
            <>
              <p>ALERT</p>
              <Switch
                  onChange={(prop)=> {
                    setIsAlert(prop)
                  }}
                  checked={isAlert}
                  onClick={(prop)=> {
                    setIsAlert(prop)
                  }}
              />
            </>
            <>
              <p>BREAKING</p>
              <Switch
                  onChange={(prop)=> {
                    setIsBreaking(prop)
                  }}
                  checked={isBreaking}
                  onClick={(prop)=> {
                    setIsBreaking(prop)
                  }}
              />
            </>
          </Card>

          <ArticleImages
            article={article}
          />

        </Card>

      </Col>
    </Row>

  </Card>
}