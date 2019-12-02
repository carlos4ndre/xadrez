import React, { Component } from 'react'
import { Grid, Image, List, Header, Icon, Modal } from 'semantic-ui-react'
import { PlayersProps } from 'types/props'
import { PlayerStatus } from 'types/player'
import CreateGameForm from 'containers/Forms/CreateGameForm'


class Players extends Component<PlayersProps> {

  colorStatus = (color: number) => {
    switch (color) {
      case PlayerStatus.ONLINE: return 'green'
      default: return 'grey'
    }
  }

  render() {
    return (
      <Grid textAlign='center' columns={3}>
        <Grid.Row>
          <Header as='h1'>Players</Header>
        </Grid.Row>
        <Grid.Row>
          <List>
            {
              this.props.players.map(player => (
                <List.Item key={player.id}>
                  <Modal trigger={
                    <List horizontal>
                      <List.Item>
                        <Image avatar src={player.picture} />
                        <List.Content>
                          <List.Header>{player.name}</List.Header>
                          {player.nickname}
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <Icon color={this.colorStatus(player.status)} name='circle' />
                      </List.Item>
                    </List>
                 } size='small'>
                    <Header icon='chess' content='Create new game' />
                    <Modal.Content>
                      <CreateGameForm player={player} />
                    </Modal.Content>
                  </Modal>
                </List.Item>
              ))
            }
          </List>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Players
