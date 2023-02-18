import {Button, Card, DatePicker, Space} from 'antd'
import moment from "moment"
import i18n from "./../../../i18n"
import {useState} from "react"
import {DeleteOutlined} from "@ant-design/icons"

export const SubmitEvent = ({article, eventPublish, deleteEvent, setEvent}) => {
  moment.locale(i18n.language)
  const date = moment(eventPublish)
  // console.log(date.format('MMM DD YYYY kk:mm'))

  const [publishTime, setPublishTime] = useState(date.format('MMM DD YYYY kk:mm'))

  const deletePublishEvent = () => deleteEvent()


  const onChange = (d, s) => {
    // console.log(eventPublish)
    setPublishTime(d.format('MMM DD YYYY kk:mm'))
  }

  const publishEvent = eventPublish?<div style={{
    padding: 5,
    border: '1px solid #e9e9e9'
  }}>
    {publishTime}
    <Button icon={<DeleteOutlined />} onClick={deletePublishEvent} style={{
      marginLeft: 20
    }} />
  </div>:<></>

  return <Card title="Select publish time" style={{marginTop: 25}}>
    {
      <Space direction="vertical">
        <div style={{
          marginBottom: 20
        }}>
          {publishEvent}
        </div>
      </Space>
    }
    <Space direction="vertical">
      <DatePicker
        showTime
        onChange={onChange}
        onOk={(props) =>{
          setPublishTime(props)
          setEvent(props.format())
        }}
      />
    </Space>
  </Card>

}