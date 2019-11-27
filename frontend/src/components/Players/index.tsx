import React from 'react'
import { Grid, Image, List, Header } from 'semantic-ui-react'
import { PlayersProps } from 'types/props'

const Players = (props: PlayersProps) => (
  <Grid textAlign='center' columns={3}>
    <Grid.Row>
      <Header as='h1'>Players</Header>
    </Grid.Row>
    <Grid.Row>
      <List>
        {
          props.players.map(player => (
            <List.Item>
              <Image avatar src={player.picture} />
              <List.Content>
                <List.Header>{player.name}</List.Header>
                {player.nickname}
              </List.Content>
            </List.Item>
          ))
        }
      </List>
    </Grid.Row>
  </Grid>
)

export default Players
