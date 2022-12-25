import React, {useState,useEffect} from 'react';
import {AutoComplete, Card, Modal} from "antd";
import {useGetAllAuthorsQuery} from "../../../services/authors";
import i18n from "../../../i18n";

const SelectAuthor = ({visible, onCancel, onOk})=>{
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [loading, setLoading] = useState(false)
  const {data, isLoading, isSuccess} = useGetAllAuthorsQuery()


  useEffect(() => {
    if (isSuccess){

      setOptions(data.map(author => {

        if(author.translations.length===0){
          return {
            value: String(),
            label: "NO Full Name Author TRanslations",
          }
        } else {
          return {
            value: String(author.id),
            label: String(author.translations.find(({locale})=>locale===i18n.language).full_name),
          }
        }

      }))

    }
    if (isLoading){
      setLoading(true)
    } else {
      setLoading(false)
    }

  }, [isSuccess, isLoading])

  const onSelect = (data, option) => {
    setSelectedOption(option)
    setInputValue(option.label)
  }
  const onChange = (data, option) => {
    setInputValue(data);
    setSelectedOption(option);
  }

  return <Modal
    visible={visible}
    onCancel={onCancel}
    onOk={()=>{
      onOk(selectedOption)
    }}
  >
    <Card loading={loading}>
      <h4>Add new</h4>
      <AutoComplete
        value={inputValue}
        allowClear={true}
        options={options}
        onSelect={onSelect}
        onChange={onChange}
        filterOption={true}
        style={{
          width: '100%',
        }}
        placeholder="input here"
      />
    </Card>
  </Modal>
}

export default SelectAuthor;