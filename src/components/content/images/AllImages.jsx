import {useGetAllImagesQuery} from "../../../services/images"
import {useEffect, useState} from "react"
import {Card, Col, Image, Row, Spin, Checkbox, Pagination } from "antd"

const AllImages = ({onOk, articleImages}) => {


  const [page, setPage] = useState(1)
  const [images, setImages] = useState()
  const {data, isLoading, isSuccess} = useGetAllImagesQuery(page)
  const [selectedImages, setSelectedImages] = useState([])
  const [currentPage, setCurrentPage] = useState()
  const [total, setTotal] = useState()
  const [perPage, setPerPage] = useState()
  useEffect(() => {
    if (isSuccess){

      const arr = []
      data.data.map((image) =>{
        if(articleImages.find(({id})=>image.id===id)){
          arr.push(image.id)
        }
      })
      setCurrentPage(data.current_page)
      setTotal(data.total)
      setPerPage(data.per_page)
      setSelectedImages(arr)
      onOk(arr)
      setImages(data.data)
    }
  }, [isSuccess]);
  const onChange = (checkedValues) => {
    setSelectedImages(checkedValues)
    onOk(checkedValues)
  }


  if (isLoading){
    return <Spin />
  }

  const imageItems = images?.map(image => {
    const {id, path, name} = image
    return ((<Col span={6} key={id}>
      <Card key={id} cover={<Image src={process.env.REACT_APP_URL+path+'/'+name} preview={false} />}>
        <Checkbox value={id}>{name}</Checkbox>
      </Card>
    </Col>))
  })

  return <Checkbox.Group
      value={selectedImages.length>0?selectedImages:[]}
      style={{
        width: '100%',
      }}
      onChange={onChange}
  ><Row gutter={16}>{
    imageItems
  }</Row>
    <Pagination current={currentPage} total={total}  />
  </Checkbox.Group>
}

export default AllImages