import {useGetArticleQuery} from "../../../services/articles";
import {useParams} from "react-router-dom";
import {Button, Card, Col, Input, Row, Space} from "antd";
import React, {useEffect, useState} from "react";
import i18n from "../../../i18n";
import {BodyEditor} from "./editor";

export const ArticleForm = ()=>{
  const {article} = useParams()

  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState(i18n.language);
  const [visits, setVisits] = useState(0);
  const [title, setTitle] = useState('');
  const [isBreaking, setIsBreaking] = useState(false)
  const [isAlert, setIsAlert] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [status, setStatus] = useState('');
  const [body, setBody] = useState('');
  const [lead, setLead] = useState('');

  const setState = (
    title,
    lead,
    body,
    status,
    isBreaking,
    isAlert,
    isFlash,
    visits
  )=>{
    setTitle(title)
    setLead(lead)
    setBody(body)
    setStatus(status)
    setIsBreaking(isBreaking)
    setIsAlert(isAlert)
    setIsFlash(isFlash)
    setVisits(visits)
  }

  i18n.on('languageChanged',lng=>{
    setLocale(lng)
  })


  const {
    data: articleData,
    isLoading: articleLoading,
    isSuccess: articleSuccess
  } = useGetArticleQuery({article, locale})

  useEffect(() => {

    if (articleLoading){
      setLoading(true)
    }

    if (articleSuccess){
      setLoading(false)

      const {
        id,
        category_id,
        translations,
        is_alert,
        is_breaking,
        is_flash,
        visits
      } = articleData

      const {title, lead, body, status} = translations.find(translation=>{
        if (translation.locale === locale){
          return {
            title: translation.title,
            lead: translation.lead,
            body: translation.body,
            status: translation.status
          }
        } else {
          return {
            title: 'translation.title',
            lead: 'translation.lead',
            body: 'translation.body',
            status: translation.status
          }
        }
      })

      setState(
        title,
        lead,
        body,
        status,
        is_breaking,
        is_alert,
        is_flash,
        visits.score
      )
    }

  }, [articleLoading,articleSuccess]);

  const handleTitleChange = title => {
    setTitle(title.target.value)
  }

  return <Card
    loading={loading}
    title={`${title}(${visits})`}
    extra={<Space direction="horizontal">
      <Button onClick={()=>{} }type='success'>Save</Button>
      <Button type="info" onClick={()=>{}}>Save & Close</Button>
      <Button type="danger" onClick={()=>{}}>Close</Button>
    </Space>}
  >
    <Input size='large' maxLength={200} showCount={true} onChange={handleTitleChange} value={title} />
    <Row>
      <Col span={18}>
        <Card>
          <Input.TextArea>{lead}</Input.TextArea>
          <BodyEditor
            initialValue={body}
            onEdit={()=>{

            }}
          />
        </Card>

      </Col>
    </Row>
    <h1>ARTICLE</h1>
  </Card>
}