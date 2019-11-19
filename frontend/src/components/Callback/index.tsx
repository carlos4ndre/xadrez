import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const Callback = () => (
  <Dimmer active>
    <Loader content='Loading' />
  </Dimmer>
)

export default Callback
