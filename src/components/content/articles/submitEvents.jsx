import {Button, Card, DatePicker, Space} from 'antd'
import React, {useState, useEffect} from "react";
import {useSetArticlePublishTimeMutation, useDeleteArticlePublishTimeMutation} from "../../../services/articles";
import i18n from "../../../i18n";
import moment from "moment"
import {DeleteOutlined} from "@ant-design/icons";

const SubmitEvents = ({article, eventPublish, status, translationId, deleteEvent }) => {
  moment.locale(i18n.language)
  // const pubEvent = new Date(publish_event)
  const date = moment(eventPublish)



  const [setArticlePublishTime,{data,isSuccess}] = useSetArticlePublishTimeMutation()
  // const [deleteEvent,{data: deletedData,isSuccess: deletedSuccess}] = useDeleteArticlePublishTimeMutation()
  const [publishTime,setPublishTime] = useState(date.format('MMM DD YYYY kk:mm'))

  const deletePublishEvent = () => {
    deleteEvent()
  }
  // setPublishTime()


  // console.log('SubmitEvents', publish_event)
  useEffect(() => {

    if(isSuccess){

      const {id, translations} = data
      const {publish_at} = translations.find(({locale})=>locale===i18n.language)

      const date = moment(publish_at)
      setPublishTime(date.format('MMM DD YYYY kk:mm'))

      // setPublishTime(publish_at)
    }
    // if (deletedSuccess){
    //   const {translations} = deletedData
    //   const {publish_at} = translations.find(({locale})=>locale===i18n.language)
    //   const date = moment(publish_at)
    //   setPublishTime(date.format('MMM DD YYYY kk:mm'))
    // }
  }, [
      isSuccess,
    eventPublish,
    // deletedSuccess
  ]);

  const onChange = (date, dateString) => {
    setPublishTime(date)
    // console.log('onChange', dateString)

  }

  const publishEvent = eventPublish?<div style={{
    padding: 5,
    border: '1px solid #e9e9e9',
  }}>
    {publishTime}
    <Button icon={<DeleteOutlined />} onClick={deletePublishEvent} style={{
      marginLeft: 50
    }} />
  </div>:(<></>)

  return <Card title="Select publish time" style={{marginTop: 25}} >
    {
      <Space direction="vertical">
        <div style={{
          marginBottom: 20,
        }}>
          {publishEvent}
        </div>
      </Space>
    }
    <Space direction='vertical'>
      <DatePicker showTime onChange={onChange} onOk={(props)=>{
        console.log('on ok', props.format())
        setPublishTime(props)
        setArticlePublishTime({
          id: article,
          body: {
            locale: i18n.language,
            time: props.format()
          }
        })
      }} />
    </Space>
  </Card>
}

export default SubmitEvents