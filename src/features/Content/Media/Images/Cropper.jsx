import {Card, Col, Modal, Row, Image} from "antd"
import ReactCrop from "react-image-crop";
import 'react-image-crop/src/ReactCrop.scss'
import {useEffect, useRef, useState} from "react";
import {Button} from "antd/es";
import {imageThumbnails, useCropImageMutation, useGetImageThumbnailsQuery} from "../../../../services/imageThumbnails";
import {useGetRenditionsQuery} from "../../../../services/images";
import {useDebounceEffect} from "../../../../utils/useDebounceEffect";
import {CanvasPreview} from "./CanvasPreview";

export const Cropper = ({visible, image, onOk, onCancel}) => {

  const imageRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const [selectedRendtition, setSelectedRendtition] = useState()
  const [completeCrop, setCompleteCrop] = useState()
  const [aspect, setAspect] = useState()
  const {data: thumbs, isLoading: thumbnailsLoading, isSuccess: thumbnailsSuccess} = useGetImageThumbnailsQuery(image.id)
  const [cropImage] = useCropImageMutation()
  const {data: renditions, isLoading: renditionsLoading, isSuccess: renditionsSuccess} = useGetRenditionsQuery()
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    aspect
  })
  useEffect(() => {
    if (renditionsSuccess){
      setSelectedRendtition(renditions[0].id)
      setCrop({
        unit: "%",
        width: 100,
        aspect: renditions[0].aspect
      })
      setAspect(renditions[0].aspect)
    }
  }, [renditionsSuccess])

  useDebounceEffect(async ()=>{
    if (crop?.width && crop?.height && imageRef.current && previewCanvasRef.current){
      CanvasPreview(
        imageRef.current,
          previewCanvasRef.current,
          crop,
          1
      )
    }
  }, 100, [crop])

  const selectRendtition = id => {
    setSelectedRendtition(id)
    const {aspect, coords} = thumbs.find(thumb => thumb.rendition_id === id)
    setAspect(aspect)
    if (Object.keys(coords).length !== 0) {
      setCrop(coords)
    }
  }

  const thumbnails = thumbs?.map(({path, id, rendition_id, rendition})=><div className="thumbnail-container" key={id}>
    <Card
      cover={
        completeCrop && selectedRendtition === rendition_id ?
        <canvas ref={previewCanvasRef}/> :
        <Image src={process.env.REACT_APP_URL+path} />
      }
      hoverable
      onClick={()=>selectRendtition(rendition_id)}
      bodyStyle={
        selectedRendtition === rendition_id ? {
          background: '#f0f2f5',
          boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
        } : {}
      }
    >
      <h4>{rendition.name}</h4>
      <p>{rendition.width} x {rendition.height}</p>
    </Card>
  </div>)


  return <Modal
    visible={visible}
    onCancel={onCancel}
    onOk={() => {

      onOk()
    }}
    width="70%"
  >
    <Row>
      <Col span={4}>{thumbnails}</Col>
      <Col span={20}>
        <Card>
          <ReactCrop
            crop={crop}
            aspect={aspect}
            onChange={(c, p)=>{
              setCrop(p)
            }}
            onComplete={(c, p) => {
              setCompleteCrop(p)
              setCrop(c)
            }}
          >
            <img ref={imageRef} src={process.env.REACT_APP_URL + image.path}/>
          </ReactCrop>
          <Button onClick={()=>cropImage({
            image: image.id,
            rendition: selectedRendtition,
            crop: {p: completeCrop, c: crop}
          })}>Save</Button>
        </Card>
      </Col>
    </Row>
  </Modal>
}