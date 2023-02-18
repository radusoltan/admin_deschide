import {Link, useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../../hooks/auth";
import {
  useAddArticleMutation,
  useGetArticlesByCategoryQuery,
  useSearchByCategoryQuery
} from "../../../services/articles";
import {useEffect, useState} from "react";
import {useAddCategoryMutation} from "../../../services/categories";
import {Button, Card, Input, notification, Pagination, Table} from "antd";
import {useTranslation} from "react-i18next";
import {AddArticle} from "./Forms";

export const Category = () => {

  const {t} = useTranslation()
  const navigate = useNavigate()

  const {category} = useParams()
  const {permissions} = useAuth({
    redirectIfAuthenticated: `/content/categories/${category}`
  })

  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [isNew, setIsNew] = useState(false);

  const {data, isLoading, isSuccess} = useGetArticlesByCategoryQuery({category, page, q})

  const [addArticle,{isLoading: addIsLoading, data: addData, isSuccess: addIsSuccess, error, isError}] = useAddArticleMutation()

  useEffect(() => {

    if (addIsSuccess){
      if (addData.errorInfo){
        notification.error({
          message: t(addData.errorInfo[2])
        })
      } else {
        const {id} = addData
        navigate(`/content/articles/${id}`)
        setIsNew(false)
      }
    }

  }, [addIsSuccess, isError, isSuccess ]);

  const button = permissions.includes('article-create') ?
    <Button type="success" onClick={()=>{
      setIsNew(true)
    }} >
      {t('pages.content.categories.add')}
    </Button> :
    <></>


  const columns = [
    {
      title: "Title",
      key: "title",
      dataIndex: 'title',
      render: (text,{key}) => permissions.includes('article-edit') ?  (<Link to={`/content/articles/${key}`}>{text}</Link>) : (<>{text}</>)
    }
  ]

  const dataSource = data?.data.map(({id, title, slug})=>({
    key:id, title, slug
  }))

  return <Card
    loading={isLoading || addIsLoading}
    extra={button}
  >
    <Input.Search
      onSearch={value =>{
        setQ(value)
      }}
    />

    <Table columns={columns} dataSource={dataSource} pagination={false} />
    <Pagination total={data?.total} defaultCurrent={page} onChange={(page)=>setPage(page)} />

    <AddArticle
      visible={isNew}
      onCancel={() =>{
        setIsNew(false)
      }}
      onAdd={(values)=>{
        addArticle({category, values})
      }}
    />
  </Card>
}