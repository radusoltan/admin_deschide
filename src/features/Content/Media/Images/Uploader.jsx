import {Modal, Upload} from "antd"
import {InboxOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useUploadArticleImagesMutation} from "../../../../services/images";

export const Uploader = ({visible, article, onOk}) => {

  const [imageList, setImageList] = useState([])
  const [upload] = useUploadArticleImagesMutation()

  const uploadProps = {
    onRemove: file => {
      const index = imageList.indexOf(file)
      const newImageList = imageList.slice()
      newImageList.splice(index, 1)
      setImageList(newImageList)
    },
    beforeUpload: file => {
      setImageList([...imageList, file])
      return false
    },
    listType: "picture",
    accept: 'image/*'
  }

  return <Modal
    visible={visible}
    onCancel={()=>{

    }}
    onOk={()=>{

      const body = new FormData()
      imageList.forEach(file=>body.append('images[]', file))
      upload({article, body})
      setImageList([])

      onOk()


    }}
  >
    <Upload.Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Upload.Dragger>
  </Modal>
}