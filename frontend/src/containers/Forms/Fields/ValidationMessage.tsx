import React from 'react'
import { Message } from 'semantic-ui-react'

const ValidationMessage = (props: any) => {
  const { touched, error, warning } = props

  return (
    <div>
      {touched &&
        ((error && <Message negative content={error}/>) ||
         (warning && <Message warning content={warning}/>))}
    </div>
  )
}

export default ValidationMessage
