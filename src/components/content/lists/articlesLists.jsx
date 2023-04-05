import {useAddArticleToListMutation, useDetachArticleFromListMutation, useGetListsQuery} from "../../../services/lists";
import {Button, Card, List} from "antd";
import React, {useEffect} from "react";
import {DeleteOutlined} from "@ant-design/icons";
import i18n from "../../../i18n";

export const ArticlesLists = () => {

  const {data: listsData, isLoading: listsIsLoading, isSuccess: listsIsSuccess} = useGetListsQuery()
  const [addArticleToSelectedList,{data: attachData, isSuccess: attachSuccess, isLoading: attachLoading}] = useAddArticleToListMutation()
  const [detachArticleFromSelectedList, {data: detachData, isSuccess: detachSuccess, isLoading: detachLoading}] = useDetachArticleFromListMutation()

  useEffect(() => {

  }, [listsIsSuccess]);


  return <Card
    loading={listsIsLoading || attachLoading || detachLoading}
  >
    {listsData.map(list =>(<Card key={list.key} title={list.name + ` (${list.count})`}>
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
              title={item.translations.find(({locale}) => locale === i18n.language).title}
            />
          </List.Item>
        }}
      />
    </Card>))}
  </Card>
}