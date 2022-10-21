import React from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Card, Form, Input, Space } from 'antd'
import { useGetArticleAuthorsQuery, useSearchAuthorMutation, useAddArticleAuthorsMutation } from '../../../services/authors'
import { useState } from 'react'
import i18n from '../../../i18n'
import { useEffect } from 'react'



const ArticleAuthors = ({article}) => {

  const {data: articleAuthors} = useGetArticleAuthorsQuery(article)
  
  

  return <Form.List name="authors">
    
    {articleAuthors=>(
      <>
        {articleAuthors.map(author=>{
          <Form.Item  >
            <Input />
          </Form.Item>
        })}
      </>
    )}
    
  </Form.List>
}

export default ArticleAuthors