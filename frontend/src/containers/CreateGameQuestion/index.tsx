import React, { Component } from 'react'
import { connect } from 'react-redux'
import { acceptGame, rejectGame } from 'actions'
import { AppState } from 'types/state'
import { CreateGameQuestionProps } from 'types/props'
import { Game } from 'types/game'
import { Button, Label } from 'semantic-ui-react'

class CreateGameQuestion extends Component<CreateGameQuestionProps, AppState> {

  handleAcceptClick = () => this.props.acceptGame(this.props.game)
  handleRejectClick = () => this.props.rejectGame(this.props.game)

  render() {
    const { game, challenger } = this.props

    return (
      <div>
        <Label>Would you like to play?</Label>
        <Button.Group>
          <Button positive onClick={this.handleAcceptClick}>Accept</Button>
            <Button.Or />
          <Button onClick={this.handleRejectClick}>Next Time</Button>
        </Button.Group>
      </div>
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
