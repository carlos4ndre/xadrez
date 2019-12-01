import React from 'react'
import { Grid, Image, List, Header, Icon } from 'semantic-ui-react'
import { PlayersProps } from 'types/props'
import { PlayerStatus } from 'types/player'

const colorStatus = (color: number) => {
  switch (color) {
    case PlayerStatus.ONLINE: return 'green'
    default: return 'grey'
  }
}

const Players = (props: PlayersProps) => (
  <Grid textAlign='center' columns={3}>
    <Grid.Row>
      <Header as='h1'>Players</Header>
    </Grid.Row>
    <Grid.Row>
      <List>
        {
          props.players.map(player => (
            <List.Item key={player.id}>
              <List horizontal>
                <List.Item>
                  <Image avatar src={player.picture} />
                  <List.Content>
                    <List.Header>{player.name}</List.Header>
                    {player.nickname}
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon color={colorStatus(player.status)} name='circle' />
                </List.Item>
              </List>
            </List.Item>
          ))
        }
      </List>
    </Grid.Row>
  </Grid>
)

export default Players
