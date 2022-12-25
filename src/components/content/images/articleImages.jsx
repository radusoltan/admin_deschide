import {Card, Image, Spin, Button, Radio, Divider, Space, notification, Modal} from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  ScanOutlined,
  EditOutlined
} from "@ant-design/icons"
import React, { useEffect, useState } from 'react'
import {
  useGetImagesByArticleQuery,
  useDetachArticleImageMutation,
  useSetArticleMainImageMutation,
  useAttachArticleImageMutation
} from '../../../services/images'
import { ArticleImageUploader } from './uploader'
import { Cropper } from './cropper'
import AllImages from "./AllImages";

export const ArticleImages = ({article}) => {

  const [upload,setUpload] = useState(false)

  const {data, isLoading, refetch} = useGetImagesByArticleQuery(article)
  const [setArticleMainImage] = useSetArticleMainImageMutation()
  const [detachArticleImages,{isLoading: detachIsLoading}] = useDetachArticleImageMutation()
  const [attachArticleImages] = useAttachArticleImageMutation()
  const [crop,setCrop] = useState(false)
  const [SelectFromLibrary, setSelectFromLibrary] = useState(false);
  const [selectedImages, setSelectedImages] = useState()

  const selectFromLibrary = () => {
    setSelectFromLibrary(true)
  }

  if (isLoading){
    return <Spin />
  }

  const images = data.map(({id, path, width, height, isMain})=><div className='thumbnail-container' key={id}>
  <Card
    key={id}
    cover={
      <Image src={process.env.REACT_APP_URL+path} preview={false} />
    }
    bodyStyle={
      isMain ? {
        background: '#f0f2f5',
        boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
      } : {}      
    }
  >
    <Divider orientation="right">{width} x {height}</Divider>
    <Radio 
      checked={isMain} 
      onChange={()=>{
        setArticleMainImage({ article, image: id })
      }}
    >Set Main</Radio>
    <Space>
      <Button
        icon={<DeleteOutlined />} 
        onClick={() =>{
          detachArticleImages({ article, id })
        }}
        type="danger" 
      />
      {isMain ? 
        <Button
          icon={<ScanOutlined />} 
          type='info'
          onClick={()=>{
            setCrop(true)
          }}
        />
      : ''}
    </Space>
    
  </Card></div>)

  return <Card extra={<Space direction="horizontal">
    <Button className='image-card-buttons' type="primary" onClick={selectFromLibrary} >Select</Button>
    <Button
        className='image-card-buttons'
        type="info"
        icon={<UploadOutlined />}
        onClick={() =>{
          setUpload(true)
        }}
    >
      Upload
    </Button>
  </Space>} loading={detachIsLoading}>
    {images}
    
    <ArticleImageUploader 
      visible={upload} 
      onCancel={()=>{
        setUpload(false)
      }}
      article={article}
      onUpload={()=>{
        setUpload(false)
      }}
    />

    {
      images.length === 0 ? '' :
        <Cropper
          visible={crop}
          image={data.find(({isMain})=>isMain)}
          onOk={()=>setCrop(false)}
          onCancel={()=>setCrop(false)}
        />
    }

    <Modal
      visible={SelectFromLibrary}
      width={'80%'}
      onOk={()=>{
        attachArticleImages({article,selectedImages})
        setSelectFromLibrary(false)
      }}
      onCancel={()=>{
        setSelectFromLibrary(false)
      }}
    >
      <AllImages
        onOk={(selected)=>{
          setSelectedImages(selected)
        }}
        articleImages={data}
      />
    </Modal>
    
  </Card>
}
