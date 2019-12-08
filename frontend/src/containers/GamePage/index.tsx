import React, { Component } from 'react'
import * as selectors from 'selectors'
import { connect } from 'react-redux'
import { AppState } from 'types/state'
import { GameProps } from 'types/props'
import { Grid, Header, Container, List, Dimmer, Loader } from 'semantic-ui-react'
import PlayerIcon from 'components/PlayerIcon'
import ChessBoard from 'containers/ChessBoard'

class GamePage extends Component<GameProps, AppState> {
  render() {
    const { game, whitePlayer, blackPlayer, color } = this.props

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1' color='black' textAlign='center'>Game</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={3}>
          <Grid.Column>
            <Header as='h2'>Chat Room</Header>
            <Container text>
              <List>
              </List>
            </Container>
          </Grid.Column>
          <Grid.Column>
            <ChessBoard orientation={color} game={game} />
          </Grid.Column>
          <Grid.Column>
            <List>
              <List.Item>
                <Header as='h2'>White</Header>
                {
                  whitePlayer ?
                  <PlayerIcon player={whitePlayer} />
                  : <Dimmer active><Loader /></Dimmer>
                }
                <Header as='h2'>Black</Header>
                {
                  blackPlayer ?
                  <PlayerIcon player={blackPlayer} />
                  : <Dimmer active><Loader /></Dimmer>
                }
              </List.Item>
              <List.Item>
                <Header as='h2'>Turn to play</Header>
                {game.playerTurn}
              </List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={3}>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    const { match } = ownProps
    const gameId = match.params.gameId
    const game = selectors.getGame(state, gameId)
    const color = (state.user.profile.sub === game.whitePlayerId ? 'white' : 'black')

    return {
      game,
      whitePlayer: selectors.getPlayer(state, game.whitePlayerId),
      blackPlayer: selectors.getPlayer(state, game.blackPlayerId),
      color
    }
  }
}

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
