import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery, usePublishCategoryMutation,
  useUpdateCategoryMutation
} from "../../../services/categories";
import React, {useState} from "react";
import i18n from "../../../i18n";
import {Button, Card, Col, notification, Pagination, Space, Spin, Switch, Table} from "antd";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useAuth} from "../../../hooks/auth";
import {EditCategory, NewCategory, TranslateCategory} from "./Forms";

export const Categories = ()=>{

  const {t} = useTranslation()

  const [locale, setLocale] = useState(i18n.language);
  const [isTranslate,setIsTranslate] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [ isNew, setIsNew ] = useState(false)
  const [category,setCategory] = useState(null)


  const [page, setPage] = useState(1)
  const {permissions} = useAuth({
    redirectIfAuthenticated: `/content/categories`
  })
  i18n.on('languageChanged', lng => setLocale(lng))

  const {data,isLoading} = useGetCategoriesQuery({page,locale})
  const [addCategory] = useAddCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [publishCategory] = usePublishCategoryMutation()


  let dataSource = []
  let columns = []

  if (permissions.includes('category-edit')){
    dataSource = data?.data.map(({id,title,in_menu})=>({
      title,
      key: id,
      in_menu
    }))

    columns = [
      {
        title: t("pages.content.categories.table.title"),
        dataIndex: 'title',
        key: 'title',
        render: (text,{key}) => (
            <Link to={`/content/categories/${key}`}>{text}</Link>
        )
      },
      {
        title: t('pages.content.categories.table.in_menu'),
        dataIndex: 'in_menu',
        key: 'in_menu',
        render: (text,{key,in_menu}) => {

          return <Switch onChange={()=>{
            publishCategory({id: key, locale: i18n.language})
          }} checked={in_menu} />
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
              }}
            >Translate</Button>
            <Button
              type="warning"
              className='table-buttons'
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true)
                setCategory(key)
              }}
            />
          </>
        ),
      }
    ]

  } else {
    dataSource = data?.data.map(({id,title,in_menu})=>({
      title,
      key: id,
    }))

    columns = [
      {
        title: t("pages.content.categories.table.title"),
        dataIndex: 'title',
        key: 'title',
        render: (text,{key}) => (
          <>{text}</>
          // <Link to={`/content/categories/${key}`}>{text}</Link>
        )
      },
    ]

  }



  return <Card
    extra={permissions.includes('category-create')?<Button type="success" onClick={
      ()=>{
        setIsNew(true)
      }
    } >
      {t("pages.content.categories.add")}
    </Button>:<></>}
  >
    {
      isLoading ? (<Spin />) : (
        <Col span={12} offset={6}>
          <h1>Categories</h1>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <Space direction="horizontal">
            <Pagination
              total={data?.total}
              defaultCurrent={page}
              onChange={page=>{
                setPage(page)
              }}
            />
          </Space>
        </Col>
      )
    }
    <NewCategory
      visible={isNew}
      onCancel={()=>{
        setIsNew(false)
      }}
      onCreate={values=>{
        addCategory({...values, lng: i18n.language})
        notification.success({
          message: t('pages.content.categories.messages.added')
        })
        setIsNew(false)
      }}
    />
    {
      isEdit ?
      <EditCategory
        visible={isEdit}
        id={category}
        onCancel={()=>{
          setIsEdit(false)
          setCategory(null)
        }}
        onEdit={({id, body})=>{
          updateCategory({id, body})
          notification.success({
            message: t('pages.content.categories.messages.updated')
          })
          setIsEdit(false)
          setCategory(null)
        }}
      /> :
      isTranslate ?
      <TranslateCategory
        visible={isTranslate}
        id={category}
        onCancel={()=>{
          setIsTranslate(false)
        }}
        onTranslate={({id,body})=>{
          updateCategory({id,body})
          notification.success({
            message: t('pages.content.categories.messages.updated')
          })
          setIsTranslate(false)
          setCategory(null)
        }}
      /> :
    <></>}
  </Card>
}