import { Card, DatePicker, Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import i18n from '../../../i18n'
import { useSetArticlePublishTimeMutation } from '../../../services/articles'

const PublishEvent = ({visible, onCancel, article, onOk}) => {
  const [publishTime,setPublishTime] = useState()
  const [setArticlePublishTime,{isSuccess}] = useSetArticlePublishTimeMutation()
  
  const onChange = (date, dateString) => {
    setPublishTime(dateString)
  }

  useEffect(()=>{
    if (isSuccess){
      onOk()
    }
  },[isSuccess])
  
  return <Modal 
    visible={visible} 
    onOk={()=>{
      setArticlePublishTime({
        id: article,
        body: {
          locale: i18n.language,
          time: publishTime
        }
      })
    }} 
    onCancel={()=>{onCancel()}}
  >
    <Card>
      <Space direction='verticla'>
        <DatePicker showTime onChange={onChange} />
      </Space>
    </Card>
  </Modal>
}

export default PublishEvent