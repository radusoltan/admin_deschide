import {Card, Pagination, Spin, Switch, Table, Button, notification, Col} from 'antd'
import React, {useEffect, useState} from "react"
import {
  useAddCategoryMutation, useDeleteCategoryMutation,
  useGetCategoriesQuery,
  usePublishCategoryMutation,
  useUpdateCategoryMutation
} from "../../../services/categories"
import i18n from "../../../i18n"
import {Link} from "react-router-dom"
import {DeleteOutlined, EditOutlined} from "@ant-design/icons"
import {useTranslation} from "react-i18next"
import {TranslateCategory, EditCategory, NewCategory} from "./_forms"
export const CategoriesList = () => {
  const [page, setPage] = useState(1);
  const [locale, setLocale] = useState(i18n.language);
  const [isTranslate,setIsTranslate] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [ isNew, setIsNew ] = useState(false)
  const [category,setCategory] = useState(null)


  const {data: categoriesData, isLoading, isSuccess} = useGetCategoriesQuery({page, locale})
  const [publishCategory] = usePublishCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [addCategory] = useAddCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const {t} = useTranslation()
  if (isLoading) {
    return <div>Loading</div>
  }

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
      render: (text,{key,in_menu}) => {

        return <Switch onChange={()=>{publishCategory({id:key, locale: i18n.language})}} checked={in_menu} />
      }

    },
    {
      title: '',
      render: ({ key }) => (
          <><Button
              type="danger"
              className='table-buttons'
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteCategory(key)
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
                }} />
          </>
      ),
    }
  ]


  i18n.on('languageChanged', lng => setLocale(lng))
  const changePage = (page) => {

    setPage(page)
  }



  const categoriesList = categoriesData.data.map(({id, translations})=>{
    const translation = translations.find(({locale})=>locale===i18n.language)
    if (translation){
      return {
        key: id,
        title: translation.title,
        in_menu: translation.in_menu
      }
    } else {
      return {
        key: id,
        title: 'No translation',
        in_menu: false
      }
    }
  })
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

  return <Card extra={
  <Button type="success" onClick={
    ()=>{
      setIsNew(true)
    }}>
    {t("pages.content.categories.add")}
  </Button>}>
    <Col span={12} offset={6}>
      <h1>Categories</h1>
      <Table dataSource={categoriesList} columns={columns} pagination={false} />
      <Pagination total={categoriesData?.total} defaultCurrent={page} onChange={changePage} />
    </Col>
    <NewCategory
        visible={isNew}
        onCancel={()=>{
          setIsNew(false)
        }}
        onCreate={values=>add(values)}
    />
    { isEdit ? <EditCategory
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
    /> : <></>}
  </Card>
 }