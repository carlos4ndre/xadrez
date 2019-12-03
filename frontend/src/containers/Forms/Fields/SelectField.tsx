import React from 'react'
import { Form, Select } from 'semantic-ui-react'
import { WrappedFieldProps, EventWithDataHandler } from 'redux-form'
import { ChangeEvent } from 'react'

import ValidationMessage from 'containers/Forms/Fields/ValidationMessage'

const SelectField = (props: WrappedFieldProps) => {
  const { input, meta, ...options } = props
  const handleChange: EventWithDataHandler<ChangeEvent<any>> = (event, data={}) => input.onChange(data.value)

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
