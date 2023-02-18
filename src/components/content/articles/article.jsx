import {
  useDeleteArticlePublishTimeMutation,
  useGetArticleQuery,
  useUpdateArticleMutation
} from "../../../services/articles";
import {useParams, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import i18n from "../../../i18n";
import {Alert, Button, Card, Col, Divider, Input, notification, Row, Select, Space, Switch} from "antd";
import {BodyEditor} from "./editor";
import ArticleAuthors from "../authors/ArticleAuthors";
import {ArticleImages} from "../images/articleImages";
import SubmitEvents from "./submitEvents";
import publishEvent from "./publishEvent";

const ArticleFormPage = () => {
  const {article} = useParams()
  const navigate = useNavigate()
  // const [updateArticle] = useUpdateArticleMutation()
  const {data, isLoading, isSuccess, isError} = useGetArticleQuery(article)
  const [updateArticle,{data: updateArticleData,isLoading: updateArticleDataIsLoading, isSuccess: updateArticleIsSuccess}] = useUpdateArticleMutation()
  const [deleteEvent,{data: deletedData,isSuccess: deletedSuccess}] = useDeleteArticlePublishTimeMutation()
  const {Option} = Select




  // state

  const [loading,setLoading] = useState(false)
  const [articleTitle, setArticleTitle] = useState('')
  const [articleLead, setArticleLead] = useState('')
  const [articleBody, setArticleBody] = useState('')
  const [articleIsAlert, setArticleIsAlert] = useState(false)
  const [articleIsFlash, setArticleIsFlash] = useState(false)
  const [articleIsBreaking, setArticleIsBreaking] = useState(false)
  const [articleStatus, setArticleStatus] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [eventPublish, setEventPublish] = useState('')
  const [translationId, setTranslationId] = useState('')
  const [articleVisits, setArticleVisits] = useState({})


  const body = {
    title: articleTitle,
    lead: articleLead,
    body: articleBody,
    is_flash: articleIsFlash,
    is_breaking: articleIsBreaking,
    is_alert: articleIsAlert,
    status: articleStatus,
    categoryId: categoryId,
    lng: i18n.language
  }

  useEffect(()=>{
    if (isLoading||updateArticleDataIsLoading) {
      setLoading(true)
    }
    if (isSuccess){
      // console.log('Article form', data)
      setLoading(false)
      const {id, category_id, translations, is_alert, is_breaking, is_flash, visits } = data
      const {title, lead, body, status, publish_at, id: translationId} = translations.find(({locale}) => i18n.language === locale)
      setArticleTitle(title)
      setArticleLead(lead)
      setArticleBody(body)
      setArticleIsFlash(is_flash)
      setArticleIsBreaking(is_breaking)
      setArticleIsAlert(is_alert)
      setArticleStatus(status)
      setCategoryId(category_id)
      setEventPublish(publish_at)
      setTranslationId(translationId)
      setArticleVisits(visits)

    }

    if (updateArticleIsSuccess){
      setLoading(false)
      const {id, category_id, translations, is_alert, is_breaking, is_flash, visits } = updateArticleData
      const {title, lead, body, status, publish_at, id: translationId} = translations.find(({locale}) => i18n.language === locale)
      setArticleTitle(title)
      setArticleLead(lead)
      setArticleBody(body)
      setArticleIsFlash(is_flash)
      setArticleIsBreaking(is_breaking)
      setArticleIsAlert(is_alert)
      setArticleStatus(status)
      setCategoryId(category_id)
      setEventPublish(publish_at)
      setTranslationId(translationId)
      setArticleVisits(visits)
      notification.success({
        message: 'Articol salvat',
        duration: 2
      })
    }
    if(deletedSuccess){
      setLoading(false)
      const {id, category_id, translations, is_alert, is_breaking, is_flash, visits } = deletedData
      const {title, lead, body, status, publish_at, id: translationId} = translations.find(({locale}) => i18n.language === locale)
      setArticleTitle(title)
      setArticleLead(lead)
      setArticleBody(body)
      setArticleIsFlash(is_flash)
      setArticleIsBreaking(is_breaking)
      setArticleIsAlert(is_alert)
      setArticleStatus(status)
      setCategoryId(category_id)
      setEventPublish(publish_at)
      setTranslationId(translationId)
      setArticleVisits(visits)

    }

  },[
    isSuccess,
    isLoading,
    updateArticleDataIsLoading,
    updateArticleIsSuccess,
    deletedSuccess
  ])

  // if change language redirect to category

  i18n.on('languageChanged', ()=>navigate(`/content/category/${categoryId}`))

  const handleTitleChange = title => {
    setArticleTitle(title.target.value)
  }

  const handleLeadChange = lead => {
    setArticleLead(lead.target.value)
  }

  const handleStatusChange = status => {

    setArticleStatus(status)
  }


  const save = () => {
    const arr = [
      articleIsBreaking,
      articleIsAlert,
      articleIsFlash,
    ]
    // check if switcher is selected correctly
    let checker = arr => arr.every(v => v === true);
    if(checker(arr)){
      console.log('all true')
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else if (articleIsFlash && articleIsAlert){
      console.log('check double')
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else if (articleIsFlash && articleIsBreaking){
      console.log('check double')
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else if(articleIsAlert && articleIsBreaking){
      console.log('check double')
      notification.error({
        message: 'Select only one (FLASH, ALERT or BREAKING)'
      })
    } else {

      updateArticle({article, body})
    }

  }
  const saveAndClose = () => {
    save()
    setTimeout(()=>navigate(`/content/category/${categoryId}`),2000)

  }

  const close = () => {navigate(`/content/category/${categoryId}`)}

  return <Card
    title={`Visits: ${articleVisits.score} // ${articleTitle}`}
    loading={loading}
    extra={<Space direction="horizontal">

      <Button onClick={save} type='success'>Save</Button>
      <Button type="info" onClick={saveAndClose}>Save & Close</Button>
      <Button type="danger" onClick={close}>Close</Button>
    </Space>}
  >
    <Input size="large" maxLength={200} showCount={true} onChange={handleTitleChange} value={articleTitle} />
    <ArticleAuthors
        article={article}
    />
    <Row>
      <Col span={18}>
        <Card>
          <Input.TextArea value={articleLead} onChange={handleLeadChange} />
          <BodyEditor
              initialValue={articleBody}
              onEdit={body=>{
                setArticleBody(body)
              }}
              field={'body'}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Select onChange={handleStatusChange} value={articleStatus} >
            <Option value='N'>New</Option>
            <Option value='S'>Submitted</Option>
            <Option value='P'>Published</Option>
          </Select>

          {
            articleStatus==='S' ? (
              <SubmitEvents
                article={article}
                eventPublish={eventPublish}
                translationId={translationId}
                deleteEvent={()=>{
                  deleteEvent(translationId)
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
                  setArticleIsFlash(prop)
                }}
                onClick={(prop)=> {
                  setArticleIsFlash( prop)
                }}
                checked={articleIsFlash}
              />
            </>
            <>
              <p>ALERT</p>
              <Switch
                onChange={(prop)=> {
                  setArticleIsAlert(prop)
                }}
                checked={articleIsAlert}
                onClick={(prop)=> {
                  setArticleIsAlert(prop)
                }}
              />
            </>
            <>
              <p>BREAKING</p>
              <Switch
                onChange={(prop)=> {
                  setArticleIsBreaking(prop)
                }}
                checked={articleIsBreaking}
                onClick={(prop)=> {
                  setArticleIsBreaking(prop)
                }}
              />
            </>
          </Card>

          <ArticleImages article={article} />
        </Card>
      </Col>
    </Row>
  </Card>
}

export default ArticleFormPage