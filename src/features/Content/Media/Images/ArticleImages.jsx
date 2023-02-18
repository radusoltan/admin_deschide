import {
  useDetachArticleImageMutation,
  useGetImagesByArticleQuery,
  useSetArticleMainImageMutation
} from "../../../../services/images";
import {Button, Card, Divider, Image, Radio, Space, Spin} from "antd";
import {DeleteOutlined, ScanOutlined, UploadOutlined} from "@ant-design/icons";
import {Uploader} from "./Uploader";
import React, {useState} from "react";
import {Cropper} from "./Cropper";

export const ArticleImages = ({article}) => {

  const {data, isLoading} = useGetImagesByArticleQuery(article)
  const [setArticleMainImage] = useSetArticleMainImageMutation()
  const [detachImage] = useDetachArticleImageMutation()
  const [upload, setUpload] = useState(false)
  const [crop, setCrop] = useState(false);

  const images = data?.map(({id, path, width, height, isMain})=>(<div key={id} className='thumbnail-container'>
    <Card
      cover={
        <Image src={process.env.REACT_APP_URL+path} preview={false} />
      }
      bodyStyle={
        isMain ? {
          background: "#f0f2f5",
          boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
        } : {}
      }
    >
      <Divider orientation="right">{width} x {height}</Divider>
      <Radio
        checked={isMain}
        onChange={()=>setArticleMainImage({article, image: id})}
      >Set Main</Radio>
      <Space>
        <Button icon={<DeleteOutlined />} onClick={()=>detachImage({article,id})} type="danger" />

        {isMain ?
          <Button
            icon={<ScanOutlined />}
            type="info"
            onClick={()=>setCrop(true)}
          />
        : ''}

      </Space>
    </Card>
  </div>))

  if (isLoading){
    return <Spin />
  }

  return <Card
    extra={<Space direction="horizontal">
      <Button className="image-card-buttons" onClick={()=>{}}>EditMeta</Button>
      <Button className="image-card-buttons" type="primary" onClick={()=>{}}>Select</Button>
      <Button className="image-card-buttons" type="info" icon={<UploadOutlined/>} onClick={()=>{
        setUpload(true)
      }}>Upload</Button>
    </Space>}
    loading={isLoading}
  >
    {images}

    <Uploader
      onOk={()=>setUpload(false)}
      onCancel={()=>setUpload(false)}
      visible={upload}
      article={article}
    />

    {
      images.length === 0 ? '' :
      <Cropper visible={crop} image={data.find(({isMain})=>isMain)} onOk={()=>setCrop(false)} onCancel={()=>setCrop(false)}/>
    }

  </Card>
}