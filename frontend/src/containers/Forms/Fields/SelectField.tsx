import React from 'react'
import { Form, Select } from 'semantic-ui-react'
import ValidationMessage from 'containers/Forms/Fields/ValidationMessage'

const SelectField = (props: any) => {
  const { input, meta, ...options } = props
  const handleChange = (event: any, data: any) => input.onChange(data.value)

  return (
    <div>
      <Form.Field
        {...input}
        {...options}
        control={Select}
        onChange={handleChange}
      />
      <ValidationMessage {...meta}/>
    </div>
  )
}

export default SelectField
