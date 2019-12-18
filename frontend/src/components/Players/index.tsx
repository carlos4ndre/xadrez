import React, { Component } from 'react'
import { Image, List, Icon, Message } from 'semantic-ui-react'
import { PlayersProps } from 'types/props'
import { PlayerStatus } from 'types/player'
import { Emoji } from 'emoji-mart'
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
      <List>
        {
          this.props.players && this.props.players.length > 0
          ?
          this.props.players.map(player => (
            <CreateGameForm player={player}  key={player.id}>
              <List.Item>
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
              </List.Item>
            </CreateGameForm>
          ))
          :
          <Message size='big' color='blue'>
            <Message.Header>No Players Found</Message.Header>
            <p>Try to invite your friends! <Emoji emoji='santa' size={25} /></p>
          </Message>
        }
      </List>
    )
  }
}

export default Players
