import React,{useState,useEffect} from 'react'
import { Editor } from '@tinymce/tinymce-react'

export const BodyEditor = ({initialValue, onEdit, field}) => {
  
  const [value,setValue] = useState()

  useEffect(() => setValue(initialValue ?? ''),[initialValue])
  return < Editor
    apiKey="aywo416v6fszmnbeapee6mhh1rusgyfzjbdetttu6qydo8pu"
    // initialValue = { initialValue }
    value = { initialValue }
    onEditorChange = {(newValue, editor) => {
      setValue(newValue)
      onEdit(newValue)
    }}
    init={{
      height: field==='lead' ? 150 : 500,
      menubar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | blocks |' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help |'+
        'image',
      // setup: editor => {
      //   editor.ui.registry.addButton('myButton', {
      //     icon: 'user',
      //     onAction: function (_) {
      //       editor.insertContent('&nbsp;<strong>It\'s my icon button!</strong>&nbsp;');
      //     }
      //   });
      // },
      // image_list,
      image_advtab: true,
      a11y_advanced_options: true,
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }}
  />
}
