import { Card, Button, notification, Table, Pagination, Input } from 'antd'
import React,{useEffect, useState} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useGetArticlesByCategoryQuery, useAddArticleMutation } from '../../../services/articles'
import { useTranslation } from 'react-i18next'
import { AddArticle } from './_forms'
import i18n from '../../../i18n'

export const Category = () => {
  const [page,setPage] = useState(1)
  const {category} = useParams()
  const {t} = useTranslation()
  const [isNew,setIsNew] = useState(false)
  const navigate = useNavigate()

  const [q,setQ] = useState(null)

  const { data, isLoading } = useGetArticlesByCategoryQuery({category,page,q})
  const [addArticle, { isLoading: addIsLoading, data: addData, isSuccess: addIsSuccess }] = useAddArticleMutation()
  
  useEffect(()=>{
    if (addIsSuccess){
      const {id} = addData  
      navigate(`/content/article/${id}`)
    }
  }, [addIsSuccess])  

  const add = values => {
    addArticle({category,values})
    notification.success({
      message: 'Articol adugat cu succes!'
    })
    setIsNew(false)
  }

  const changePage = page => {
    setPage(page);
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, {key}) => (
        <Link to={`/content/article/${key}`}>{text}</Link>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => <h3>{text}</h3>
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => <p>{text}</p>
    }
  ]

  const articles = data?.data.map(({ id, status, translations, created_at })=>{

    const translation = translations.find(({locale})=>i18n.language===locale)

    return translation ? {
      key: id,
      status,
      title: translation.title,
      created_at
    } : {
      key: id, 
      status,
      title: 'No trans',
      created_at
    }
  })

  return <Card 
    loading={isLoading||addIsLoading}
    extra={<Button type="success" onClick={()=>{
      setIsNew(true)
    }} >{t("pages.content.categories.add")}</Button>}
  >
    <Input.Search onSearch={(value)=>{
      setQ(value)
      setPage(1)
    }} />
    <Table dataSource={articles} columns={columns} pagination={false} />
    <Pagination total={data?.total}
      defaultCurrent={data?.current_page}
      pageSize={data?.per_page}
      onChange={changePage} />
    <AddArticle visible={isNew} onCancel={()=>{
      setIsNew(false)
    }} onAdd={add} />

  </Card>
}
