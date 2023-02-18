import React, {useEffect, useState} from 'react'
import {
  DeleteOutlined,
  UnorderedListOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import {Button, Card, List, Space} from 'antd'
import {
  useGetArticleAuthorsQuery,
  useAddArticleAuthorsMutation,
  useDeleteArticleAuthorMutation
} from '../../../services/authors'
import i18n from '../../../i18n'
import AddAuthor from "./addAuthor"
import SelectAuthor from "./selectAuthor"

const ArticleAuthors = ({article}) => {

  const {data, isLoading, isSuccess} = useGetArticleAuthorsQuery(article)
  const [addAuthor, {isLoading: isAddAuthorLoading, data: addAuthorData, isSuccess: addAuthorIsSuccess}] = useAddArticleAuthorsMutation()
  const [deleteAuthor, {data: deleteAuthorData, isSuccess: deleteAuthorIsSuccess, isLoading: deleteAuthorIsLoading}] = useDeleteArticleAuthorMutation()

  const [authors, setAuthors] = useState([])
  const [isNew, setIsNew] = useState(false)
  const [isSelect, setIsSelect] = useState(false)

  useEffect(() => {
    if(isSuccess){
      setAuthors(data)
    }

    if (addAuthorIsSuccess){
      setAuthors(addAuthorData)
    }

    if (deleteAuthorIsSuccess){
      setAuthors(deleteAuthorData)
    }
  }, [isSuccess, isLoading, isAddAuthorLoading, addAuthorIsSuccess, deleteAuthorIsSuccess]);

  const add = ()=> {
    setIsNew(true)
  }

  const selectAuthor = ()=> {
    setIsSelect(true)
  }

  const addSelectedAuthor = (selectedOption)=> {
    const body = {
      author: parseInt(selectedOption.value),
      locale: i18n.language
    }
    addAuthor({article, body})
    setIsSelect(false)
  }

  const addNewArticleAuthor = values => {
    const body = {
     ...values,
      locale: i18n.language
    }
    addAuthor({article, body})
    setIsNew(false)
  }
  return <Card
    loading={isLoading || isAddAuthorLoading || deleteAuthorIsLoading}
    title={'Authors'}
    extra={<Space>
      <Button onClick={add} type='success' icon={<UserAddOutlined />} />
      <Button onClick={selectAuthor} type='primary' icon={<UnorderedListOutlined />} />
    </Space>}
  >
    <List
      itemLayout={'horizontal'}
      dataSource={authors}
      renderItem={({translations}) => {
        const author = translations.find(({locale})=>i18n.language===locale)
        return (
          <List.Item actions={[
            <Button
              onClick={()=>deleteAuthor({article,authorId: author.author_id})}
              type="danger"
              icon={<DeleteOutlined />}
            />
          ]}>
            <List.Item.Meta
              title={author.full_name}
            />
          </List.Item>
        )
      }}
    />
    {/*<SelectAuthor*/}
    {/*  visible={isSelect}*/}
    {/*  onCancel={() => setIsSelect(false)}*/}
    {/*  article={article}*/}
    {/*  onOk={(selectedOption) => addSelectedAuthor(selectedOption) }*/}
    {/*/>*/}
    <AddAuthor
      visible={isNew}
      onCancel={()=>{
        setIsNew(false)
      }}
      onOk={(values) => addNewArticleAuthor(values) }
    />
  </Card>
}

export default ArticleAuthors