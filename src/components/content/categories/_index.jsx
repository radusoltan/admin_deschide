import { Card, Pagination, Spin, Switch, Table, Button, notification  } from 'antd'
import React, { useState } from 'react'
import { useGetCategoriesQuery, useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, usePublishCategoryMutation } from '../../../services/categories'
import i18n from '../../../i18n'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { EditCategory, NewCategory, TranslateCategory } from './_forms'
import { editableInputTypes } from '@testing-library/user-event/dist/utils'

export const Categories = () => {
  const [page,setPage] = useState(1)
  const [ isNew, setIsNew ] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [isTranslate,setIsTranslate] = useState(false)
  const [category,setCategory] = useState(null)
  const {t} = useTranslation()
  const {data: paginatedCategories, isLoading} = useGetCategoriesQuery(page)
  const [addCategory] = useAddCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [publishCategory] = usePublishCategoryMutation()
  // console.log(paginatedCategories)

  const add = values => {
    addCategory({...values,lng:i18n.language})
    notification.success({
      message: t('pages.content.categories.messages.added')
    })
    setIsNew(false)
  }

  const edit = ({id,body}) => {
    updateCategory({id,body})
    notification.success({
      message: t('pages.content.categories.messages.updated')
    })
    setIsEdit(false)
    setCategory(null)
  }

  const translate = ({id,body}) => {

    updateCategory({id,body})
    notification.success({
      message: t('pages.content.categories.messages.updated')
    })
    setIsTranslate(false)
    setCategory(null)
  }

  const publish = key => {
    publishCategory(key)
  }

  const handleDelete = id => {
    deleteCategory(id)
  }

  if (isLoading) <Spin />

  const changePage = page => setPage(page)

  const columns = [
    {
      title: t("pages.content.categories.table.title"),
      dataIndex: 'title',
      key: 'title',
      render: (text,{key}) => (
          <Link to={`/content/category/${key}`}>{text}</Link>
      )
    },
    {
      title: t('pages.content.categories.table.in_menu'),
      dataIndex: 'in_menu',
      key: 'in_menu',
      render: (text,{key,in_menu}) => (
          <Switch onChange={()=>{
            publish(key)
          }} checked={in_menu} />
      )

    },
    {
      title: '',
      render: ({ key }) => (
          <><Button
              type="danger"
              className='table-buttons'
              icon={<DeleteOutlined />}
              onClick={() => {
                handleDelete(key)
              }}
          />


            <Button
                type="info"
                className='table-buttons'
                onClick={() => {
                  setIsTranslate(true)
                  setCategory(key)
                }}>Translate</Button>
            <Button
                type="warning"
                className='table-buttons'
                icon={<EditOutlined />}
                onClick={() => {
                  setIsEdit(true)
                  setCategory(key)
                  // return <EditCategoryForm id={category} visible={isEdit} onEdit={onEdit} />
                }} />
          </>
      ),
    }
  ]

  const categories = paginatedCategories?.data.map(({id,in_menu,translations})=>{
    const translation = translations.find(({ locale }) => locale === i18n.language)
    return translation ? ({
      key: id,
      title: translation.title,
      in_menu
    }) : ({
      key: id,
      title: 'No title',
      in_menu
    })
  })



  return <Card
      extra={
        <Button type="success" onClick={
          ()=>{
            setIsNew(true)
          }}>
          {t("pages.content.categories.add")}
        </Button>}
  >
    <Table dataSource={categories} columns={columns} pagination={false} />
    <Pagination
        total={paginatedCategories?.total}
        defaultCurrent={paginatedCategories?.current_page}
        onChange={changePage}
    />
    <NewCategory
        visible={isNew}
        onCancel={()=>{
          setIsNew(false)
        }}
        onCreate={values=>add(values)}
    />
    {
      isEdit ? <EditCategory
              visible={isEdit}
              onCancel={()=>{
                setIsEdit(false)
                setCategory(null)
              }}
              onEdit={edit}
              id={category}
          /> :
          isTranslate ? <TranslateCategory
              visible={isTranslate}
              id={category}
              onCancel={()=>{
                setIsTranslate(false)
              }}
              onTranslate={translate}
          /> : <></>
    }
  </Card>
}
