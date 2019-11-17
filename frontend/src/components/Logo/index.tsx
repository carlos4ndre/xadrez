import React from 'react'
import { Icon } from 'semantic-ui-react'
import StyledLink from 'components/StyledLink'

const Logo = () => (
  <h2>
    <StyledLink to='/'>
      <Icon name='chess knight'/>
      Xadrez
    </StyledLink>
  </h2>
)

export default Logo
