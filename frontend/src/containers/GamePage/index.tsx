import React, { Component } from 'react'
import * as selectors from 'selectors'
import { connect } from 'react-redux'
import { timeoutGame } from 'actions'
import { AppState } from 'types/state'
import { GameProps } from 'types/props'
import { Game } from 'types/game'
import { Grid, Header, List, Dimmer, Loader, Button, Container, Label } from 'semantic-ui-react'
import { LeaveGameForm } from 'containers/Forms'
import { Link } from 'react-router-dom'
import PlayerIcon from 'components/PlayerIcon'
import Timer from 'components/Timer'
import ChessBoard from 'containers/ChessBoard'
import ChatRoom from 'containers/ChatRoom'

class GamePage extends Component<GameProps, AppState> {
  handleComplete = () => {
    this.props.timeoutGame(this.props.game)
  }

  displayOptionValue = (text: string) => {
    let words = text.split('_')
    words = words.map(w => {
      return w.replace(/^\w/, c => c.toUpperCase())
    })
    return words.join(' ')
  }

  render() {
    const { game, whitePlayer, blackPlayer, color } = this.props
    const playerTurnColor = (game.playerTurn === whitePlayer.id ? 'white' : 'black')
    const hasTimeEnabled = (game.time !== 0)
    const startTimerWhitePlayer = (game.moves.length !== 0 && game.result === 'undetermined' && playerTurnColor === 'white')
    const startTimerBlackPlayer = (game.moves.length !== 0 && game.result === 'undetermined' && playerTurnColor === 'black')

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
                {
                  hasTimeEnabled
                  ? <Timer time={game.whitePlayerTimeLeft} autoStart={startTimerWhitePlayer} onComplete={this.handleComplete.bind(this)} />
                  : <Label color="green">No time</Label>
                }
                <Header as='h2'>Black</Header>
                {
                  blackPlayer ?
                  <PlayerIcon player={blackPlayer} />
                  : <Dimmer active><Loader /></Dimmer>
                }
                {
                  hasTimeEnabled
                  ? <Timer time={game.blackPlayerTimeLeft} autoStart={startTimerBlackPlayer} onComplete={this.handleComplete.bind(this)} />
                  : <Label color="green">No time</Label>
                }
              </List.Item>
              <List.Item>
                <Header as='h2'>Turn to play</Header>
                <Container>{this.displayOptionValue(playerTurnColor)}</Container>
              </List.Item>
              <List.Item>
                <Header as='h2'>Result</Header>
                <Container>{this.displayOptionValue(game.result)}</Container>
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

const mapDispatchToProps = (dispatch: any) => ({
  timeoutGame: (game: Game) => dispatch(timeoutGame(game))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
