import { AutoComplete, Button, Card, Checkbox, Col, Modal, Row, Spin } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import i18n from '../../../i18n'
import { 
  useGetRelatedArticlesQuery,
  useAddRelatedArticlesMutation,
  useDetachRelatedArticleMutation
} from '../../../services/related'
import {DeleteOutlined} from "@ant-design/icons"
import { useGetAllArticlesQuery, useSearchMutation } from '../../../services/articles'

const Related = ({article}) => {
  const [visible,setVisible] = useState(false)
  const [related, setRelated] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const {data:relatedData, isSuccess: relatedSuccess, isLoading: relatedLoading} = useGetRelatedArticlesQuery(article)
  const {data: articlesData, isSuccess: articlesSuccess, isLoading: articlesLoading } = useGetAllArticlesQuery(article)
  const [search,{data: searchData, isSuccess: searchSuccess, isLoading: searchLoading}] = useSearchMutation()
  const [addRelatedArticle,{data: addRelatedData, isLoading: addRelatedLoading, isSuccess: addRelatedSuccess}] = useAddRelatedArticlesMutation()
  const [detachArticle,{data: detachData}] = useDetachRelatedArticleMutation()
  useEffect(()=>{
    if (relatedSuccess){
      setRelated(relatedData)
      setLoading(false)
    }
    if (relatedLoading || articlesLoading || searchLoading || addRelatedSuccess){
      setLoading(true)
    }
    if (articlesSuccess){
      setLoading(false)
      setArticles(articlesData)
    }

    if (searchSuccess){
      console.log()
      setArticles(Object.values(searchData))
    }

  },[relatedLoading,relatedSuccess, articlesSuccess,articlesLoading,searchLoading, addRelatedSuccess])

  const add = () => {
    setVisible(true)
    
  }

  const onClear = ()=>{
    setArticles(articlesData)
  }

  const onChange = (val) => {
    console.log(val !== '');
    if (val !==''){
      console.log(val);
      const body = {
        q: val,
        locale: i18n.language
      }

      search(body)
    }    
  }

  const handleCheck = (checkedValues) => {
    addRelatedArticle({article,body: {related: checkedValues}})
  }
  

  

  return <Card
    loading={loading}
    extra={<>
      <Button onClick={add}>Add</Button>
    </>}
  >
    {related.length !== 0 ? <>{
      related?.map(({id,translations})=>(<Card key={id}>
          <h3>{translations.find(({locale})=>locale===i18n.language).title}</h3>
          <Button
            icon={<DeleteOutlined />} 
            onClick={() =>{
              detachArticle({article,body:{id}})
            }}
            type="danger" 
          />
        </Card>))
    }</>
        
        : <></>
      }
    
    <Modal
      visible={visible}
      onOk={()=>{

      }}
      onCancel={()=>{
        setVisible(false)
      }}
      width='70%'
    >
      <Card>
        <AutoComplete
         allowClear={true} 
         style={{width: '100%'}}
         onClear={onClear}
         onChange={onChange} />
        <Row>
          <Checkbox.Group
            style={{
            width: '100%',
            }}
            onChange={handleCheck}
          >{
            articles.map(({id, translations})=>(
              
                <Col span={24} key={id}>
                  <Checkbox value={id}>
                    <h4>
                      {/* {translations.find(({locale})=>locale===i18n.language).title} */}
                    </h4>
                  </Checkbox>                  
                </Col>
            
            ))}
          </Checkbox.Group>          
        </Row>
      </Card>
      
    </Modal>
  </Card>
}

export default Related