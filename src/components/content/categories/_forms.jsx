import { Modal, Form, Input, Switch, Spin, Divider, Select } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetCategoryQuery } from '../../../services/categories'
import i18n from '../../../i18n'

export const NewCategory = ({visible, onCancel, onCreate}) => {
  const {t} = useTranslation()
  const [form] = Form.useForm()
  return <Modal 
    visible={visible}
    onCancel={()=>{
      form.resetFields()
      onCancel()
    }}
    onOk={()=>{
      form
        .validateFields()
        .then(values=>{
          form.resetFields()
          onCreate(values)
        })

    }}
  >
    <Form
      form={form}
      layout="vertical"
      name="new_category_form"
      initialValues={{
        in_menu: false
      }}
    >
      <Form.Item
        label={t('pages.content.categories.form.title')}
        name="title"
        rules={[{ required: true, message: t('pages.content.categories.form.error_title') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t('pages.content.categories.form.in_menu')} name="in_menu" valuePropName="checked">
        <Switch defaultChecked={false} />
      </Form.Item>
    </Form>
  </Modal>
}

export const EditCategory = ({id ,visible, onCancel, onEdit}) => {
  const {t} = useTranslation()
  const [form] = Form.useForm()
  const {data, error, isLoading, isSuccess} = useGetCategoryQuery({id})
  if (isLoading){
    return <Spin />
  }

  const {translations, in_menu} = data

  return <Modal
    visible={visible}
    onCancel={()=>{
      onCancel()
      form.resetFields()
    }}
    onOk={()=>{
      form
        .validateFields()
        .then(values=>{
          form.resetFields()
          const body = {
            lng: i18n.language,
            ...values
          }
          onEdit({id,body})
        })
    }}
  >
    <Form
      form={form}
      layout="vertical"
      name="edit_category_form"
      initialValues={{
        in_menu,
        title: translations.find(({locale})=>i18n.language===locale) ? translations.find(({locale})=>i18n.language===locale).title : 'Notitle'
      }}
    >
      <Form.Item
        label={t('pages.content.categories.form.title')}
        name="title"
        rules={[{ required: true, message: t('pages.content.categories.form.error_title') }]}
      >
        <Input />
      </Form.Item>
       <Form.Item label={t('pages.content.categories.form.in_menu')} name="in_menu" valuePropName="checked">
        <Switch defaultChecked={false} />
      </Form.Item>

    </Form>

  </Modal>
}

export const TranslateCategory = ({visible, onCancel, id, onTranslate}) => {
  const {data,isLoading} = useGetCategoryQuery({id})
  const [form] = Form.useForm()
  const {t} = useTranslation()
  const { Option } = Select
  if (isLoading) {
    return <Spin />
  }

  const { translations, in_menu } = data
  return <Modal visible={visible} onCancel={()=>{
    form.resetFields()
    onCancel()
  }} onOk={()=>{
    form
      .validateFields()
      .then(values=>{

        form.resetFields()
        const body = {
          in_menu,
          ...values
        }
        onTranslate({id,body})

      })
  }}>
    <Form
      form={form}
      name='translate_category_form'
      layout='vertical'
    >
      {
        translations.map(({locale,title,id})=>(<div key={id}>
          <p>{locale}</p>
          <h3>{title}</h3></div>))
      }
      <Divider />
      <Form.Item name="lng" label="Language">
        <Select value={i18n.language}>
          <Option value='ro'>RO</Option>
          <Option value="en">EN</Option>
          <Option value="ru">RU</Option>
        </Select>
      </Form.Item>
      <Form.Item name='title' label='Tile' rules={[{ required: true, message: t('pages.content.categories.form.error_title') }]}>
        <Input />
      </Form.Item>
    </Form>
  </Modal>
}

export const AddArticle = ({visible,onCancel, onAdd}) => {

  const [form] = Form.useForm()
  const {Option} = Select
  const {t} = useTranslation()

  return <Modal
    visible={visible}
    onCancel={()=>{
      form.resetFields()
      onCancel()
    }}
    onOk={()=>{
      form
        .validateFields()
        .then(values=>{
          form.resetFields()
          onAdd(values)
        })
    }}
  >
    <Form
      form={form}
      layout="vertical"
      name="new_article_from"
    >
      <Form.Item 
          name='lng' 
          label="Select Language"
          initialValue={{
            lng: i18n.language
          }}
        >
          <Select>
            <Option value='ro'>RO</Option>
            <Option value='ru'>RU</Option>
            <Option value='en'>EN</Option>
          </Select>
        </Form.Item>
        <Form.Item name="title" label='title' rules={[{ required: true, message: t('pages.content.categories.form.error_title') }]}>
          <Input />
        </Form.Item>
    </Form>
  </Modal>
}
