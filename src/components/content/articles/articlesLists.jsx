import {useAddArticleToListMutation, useDetachArticleFromListMutation, useGetListsQuery} from "../../../services/lists";
import {Button, Card, List, Spin} from "antd";
import React, {useEffect, useState} from "react";
import i18n from "../../../i18n";
import {DeleteOutlined} from "@ant-design/icons";

export const ArticlesLists = ({article})=>{

  const {data: listsData, isLoading: listsIsLoading, isSuccess: listsIsSuccess} = useGetListsQuery()
  const [addArticleToSelectedList,{data: attachData, isSuccess: attachSuccess, isLoading: attachLoading}] = useAddArticleToListMutation()
  const [detachArticleFromSelectedList, {data: detachData, isSuccess: detachSuccess, isLoading: detachLoading}] = useDetachArticleFromListMutation()
  const [selectedList, setSelectedList] = useState()


  // const addArticleToSelectedList = () => {

  // }

  useEffect(() => {

    if (listsIsSuccess) {
      setLists(listsData)
    }

    if (attachSuccess){
      setLists(attachData)
    }

    if (detachSuccess){
      setLists(detachData)
    }

  }, [listsIsSuccess,attachSuccess, detachSuccess]);


  if (listsIsLoading || attachLoading) <Spin />

  const [lists, setLists] = useState([]);

  return <Card>
    {listsData?.map(list=>(<Card
      title={list.name}
      key={list.id}
      extra={list.count < list.max_item_count &&

        <Button
          onClick={()=> {
            addArticleToSelectedList({list: list.id,article})
          }}
        >Add to this list</Button>
      }
    >

      <List
        itemLayout={'horizontal'}
        dataSource={list.articles}
        renderItem={item=>{
          return <List.Item
            actions={[
              <Button
                onClick={()=>{
                  detachArticleFromSelectedList({list: list.id,article:item.id})
                }}
                type="danger"
                icon={<DeleteOutlined />}
              />
            ]}
          >
            <List.Item.Meta
              style={
                item.id === article ? {
                background: '#f0f2f5',
                boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
              } : {}}
              title={item.translations.find(({locale}) => locale === i18n.language).title}
            />
          </List.Item>

        }}
      >

      </List>

      {/*{list.articles.map(article=>(<div key={article.id}>*/}
      {/*  {*/}
      {/*    article.translations.find(({locale})=>locale===i18n.language).title*/}
      {/*  }*/}
      {/*</div>))}*/}

    </Card>))}
  </Card>
}