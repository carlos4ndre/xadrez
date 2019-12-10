import React, { Component } from 'react'
import * as selectors from 'selectors'
import { connect } from 'react-redux'
import { AppState } from 'types/state'
import { GameProps } from 'types/props'
import { Grid, Header, List, Dimmer, Loader, Button } from 'semantic-ui-react'
import { LeaveGameForm } from 'containers/Forms'
import { Link } from 'react-router-dom'
import PlayerIcon from 'components/PlayerIcon'
import ChessBoard from 'containers/ChessBoard'
import ChatRoom from 'containers/ChatRoom'

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
            <ChatRoom game={game} />
          </Grid.Column>
          <Grid.Column>
            <ChessBoard playerColor={color} game={game} />
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
          {game.result === 'undetermined' ?
            <LeaveGameForm game={game}>
              <Button>Leave Game</Button>
            </LeaveGameForm>
          :
            <Link to='/'>Go back to home page</Link>
          }
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
