import { Card, Col, Image, Row, Spin, Divider, Button } from 'antd'
import React,{useState,useRef, useEffect} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'
import { useCropImageMutation, useGetImageThumbnailsQuery } from '../../../services/imageThumbnails'
import { useDebounceEffect } from '../../../utils/useDebounceEffect'
import { canvasPreview } from './canvasPreview'
import {centerAspectCrop} from '../../../utils/cropper'

export const Cropper = ({image, rendition, renditions, complete}) => {
  
  const imageRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const {data: imageThumbnails, isLoading: thumbsLoading, isSuccess: thumbnailsSuccess} = useGetImageThumbnailsQuery(image.id)
  const [cropImage,{isSuccess, isLoading}] = useCropImageMutation()
  const [selectedRendition,setSelectedRendition] = useState(rendition)
  const [completedCrop, setCompletedCrop] = useState()

  const { aspect, name: renditionName } = renditions.find(rendition=>rendition.id===selectedRendition)
  
  const [cropConfig, setCropConfig] = useState(centerAspectCrop(image, aspect))

  useEffect(()=>{
    if (selectedRendition){
      const {coords} = renditions.find(rendition=>rendition.id===selectedRendition)
      setCropConfig(coords)
    }

    if (thumbnailsSuccess){
      console.log('Thumbs success', thumbnailsSuccess);
    }

  },[selectedRendition, thumbnailsSuccess])

  useDebounceEffect(
    async () => {
      if (
        cropConfig?.width &&
        cropConfig?.height &&
        imageRef.current &&
        previewCanvasRef.current
      ){
        canvasPreview(
          imageRef.current,
          previewCanvasRef.current,
          cropConfig,
          1
        )
      }
    }, 100, [cropConfig]
  )

  if (thumbsLoading){
    return <Spin />
  }  

  const thumbnails = imageThumbnails?.map(({ path, id, rendition_id, name, coords })=><div className='thumbnail-container' key={id}>
    <Card
      loading={isLoading}
      cover={
        completedCrop && selectedRendition === rendition_id ? 
        <canvas ref={previewCanvasRef}/> :
        <Image src={process.env.REACT_APP_URL+path} preview={false} />
      }
      hoverable
      onClick={()=>{     
        setSelectedRendition(rendition_id)      
      }}
      bodyStyle={
        selectedRendition === rendition_id ? {
          background: '#f0f2f5',
          boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
        } : {}      
      }
    >
      <Card.Meta>{ renditionName }</Card.Meta>
    </Card>
  </div>)

  return <Row>
  <Col span={6}>{thumbnails}</Col>
  <Col span={18}>
     <Card>
     <ReactCrop
        crop={cropConfig}
        onChange={(c,p)=>{
          
          setCropConfig(c)
          // setCompletedCrop(p)
        }}
        onComplete={(_,p)=>{
          setCompletedCrop(p)
          setCropConfig(_)
        }}
        aspect={aspect}
      >
        <img ref={imageRef} src={process.env.REACT_APP_URL+image.path} />
      </ReactCrop>
      <Divider />
      <Button onClick={()=>{
        cropImage({image: image.id,rendition:selectedRendition,crop:completedCrop})
        complete()
      }}>Save</Button>
    </Card> 
  </Col>
  </Row>
}
