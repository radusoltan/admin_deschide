import { Modal, Card, Image, Row, Col, Spin, Divider, Button } from 'antd'
import React,{useEffect, useRef, useState} from 'react'
import { useGetImageThumbnailsQuery, useCropImageMutation } from '../../../services/imageThumbnails'
import { useGetRenditionsQuery } from '../../../services/images'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'
import { useDebounceEffect } from '../../../utils/useDebounceEffect'
import { canvasPreview } from './canvasPreview'

export const Cropper = ({visible, onCancel, image, onOk}) => {

  const imageRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const {data: imageThumbnails, isLoading: imageThumbnailsLoading, isSuccess: imageThumbnailsSuccess } = useGetImageThumbnailsQuery(image.id)
  const {data: renditions, isLoading: renditionsLoading, isSuccess: renditionsSuccess } = useGetRenditionsQuery()
  const [cropImage] = useCropImageMutation()

  const [selectedRendition,setSelectedRendition] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [aspect,setAspect] = useState()
  const [crop,setCrop] = useState({
    // unit: '%',
    // width: 100,
    // aspect: 16/9
  })

  const selecteRendition = id => {
    setSelectedRendition(id)
    const th = imageThumbnails.find(thumb=>thumb.rendition_id===selectedRendition)

    const {aspect,coords} = renditions.find((rendition)=>id===rendition.id)
    setAspect(aspect)
    // setCrop(coords)
    if (Object.keys(coords).length != 0){
      setCrop(coords)
    }

    
  }

  useEffect(()=>{
    if (renditionsSuccess){
      setSelectedRendition(renditions[0].id);
      setCrop(renditions[0].coords)
      setAspect(renditions[0].aspect)
    }

    if (imageThumbnailsSuccess){

      imageThumbnails.map(th=>console.log(th))

    }
    

  },[renditionsSuccess,imageThumbnailsSuccess])

  useDebounceEffect(
    async () => {
      if (
        crop?.width &&
        crop?.height &&
        imageRef.current &&
        previewCanvasRef.current
      ){
        canvasPreview(
          imageRef.current,
          previewCanvasRef.current,
          crop,
          1
        )
      }
    }, 100, [crop]
  )

  if (
    imageThumbnailsLoading ||
    renditionsLoading
  ){
    return <Spin />
  }

  

  const thumbnails = imageThumbnails?.map(({ path, id, rendition_id, name, coords })=><div className='thumbnail-container' key={id}>
    <Card
      // loading={isLoading}
      cover={
        completedCrop && selectedRendition === rendition_id ? 
        <canvas ref={previewCanvasRef}/>  : //<></> 
        <Image src={process.env.REACT_APP_URL+path} preview={false} />
      }
      hoverable
      onClick={()=>{
        selecteRendition(rendition_id)     
              
      }}
      bodyStyle={
        selectedRendition === rendition_id ? {
          background: '#f0f2f5',
          boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
        } : {}      
      }
    >
      {/* <Card.Meta>{ renditionName }</Card.Meta> */}
    </Card>
  </div>)


  return <Modal
    visible={visible} 
    onCancel={onCancel} 
    width='70%' 
    onOk={()=>{ 
      cropImage({image: image.id,rendition:selectedRendition,crop:{p:completedCrop,c: crop}})
      setSelectedRendition(null)
      setCompletedCrop(null)
      setAspect(null)
      setCrop(null)
      onOk()
    }} 
  >
    <Row>
      <Col span={6}>{thumbnails}</Col>
      <Col span={18}>
        <Card>
          <ReactCrop
            crop={crop}
            aspect={aspect}
            onChange={(c,p)=>{
              setCrop(p)
            }}
            onComplete={(c,p)=>{
              setCompletedCrop(p)
              setCrop(c)
            }}
          >
            <img ref={imageRef} src={process.env.REACT_APP_URL+image.path} />
          </ReactCrop>
        </Card>
      </Col>
    </Row>
  </Modal>
}
