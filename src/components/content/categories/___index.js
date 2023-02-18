import {useGetCategoriesQuery} from "../../../services/categories";
import i18n from "../../../i18n";
import React, {useState} from "react";
import {Button, Card, Col, Pagination, Space, Spin, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export const CategoriesList = ({}) => {
  const [page, setPage] = useState(1);
  const [locale, setLocale] = useState(i18n.language);
  const [isTranslate,setIsTranslate] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [ isNew, setIsNew ] = useState(false)
  const [category,setCategory] = useState(null)
  // const [pagination, setPagination] = useState({});
  // const [categories, setCategories] =  useState([]);
  const {data, isLoading} = useGetCategoriesQuery({page,locale})

  if (isLoading) {
    return <Spin/>
  }

  const handlePageChange = page => {
    setPage(page)
    // onPageChange(page)
  }

  const deleteCategory = () =>{

  }

  const translate = (id) => {

  }
  // console.log(paginated)
  const categories = data?.data.map(category=>({
    key: category.id,
    title: category.title,
    in_menu: category.in_menu
  }))

  // publishCategory({id:key, locale: i18n.language})

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'In Menu',
      dataIndex: 'in_menu',
      key: 'in_menu',
      render: (text,{key,in_menu}) => {

        return <Switch onChange={()=>{}} checked={in_menu} />
      }
    },
    {
      title: '',
      render: ({key})=>(<><Button
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
      </>)
    },
  ];


  return <Card loading={isLoading}>
    <Col span={12} offset={6}>

      <Table dataSource={categories} columns={columns} pagination={false} />

      <Pagination
        total={data?.total}
        defaultCurrent={data?.current_page}
        onChange={handlePageChange}
        showSizeChanger={false}
        // pageSize={pagination?.per_page}
      />

    </Col>
  </Card>
}