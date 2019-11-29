import React from 'react'
import { Header, Grid, Image } from 'semantic-ui-react'

const Welcome = () => (
  <Grid>
    <Grid.Row>
      <Grid.Column>
        <Header as='h1' color='black' textAlign='center'>Welcome</Header>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Image
          centered
          rounded
          size='big'
          src={require('./images/board.jpg')}
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default Welcome
