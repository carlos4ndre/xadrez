import React, { Component } from 'react'
import { connect } from 'react-redux'
import { acceptGame, rejectGame } from 'actions'
import { AppState } from 'types/state'
import { CreateGameQuestionProps } from 'types/props'
import GameChallengeInfo from 'components/GameChallengeInfo'
import { Game } from 'types/game'
import { Button, Header, Grid } from 'semantic-ui-react'

class CreateGameQuestion extends Component<CreateGameQuestionProps, AppState> {

  handleAcceptClick = () => this.props.acceptGame(this.props.game)
  handleRejectClick = () => this.props.rejectGame(this.props.game)

  render() {
    const { game, challenger } = this.props

    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3'><h1 style={{ color: 'white' }}>Would you like to play?</h1></Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <GameChallengeInfo player={challenger} game={game} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button.Group>
              <Button positive onClick={this.handleAcceptClick}>Accept</Button>
                <Button.Or />
              <Button onClick={this.handleRejectClick}>Next Time</Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    return {}
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  acceptGame: (game: Game) => dispatch(acceptGame(game)),
  rejectGame: (game: Game) => dispatch(rejectGame(game))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGameQuestion)
