import React from 'react'
import { Message } from 'semantic-ui-react'

const SubmitErrorMessage = ({ submitErrors }: any) => (
  <div>
  { submitErrors && submitErrors.error &&
    <Message
      icon='warning'
      color='red'
      header='Ups... Kittens have taken our servers!'
      content={submitErrors.error}
    />
  }
  </div>
)

export default SubmitErrorMessage
